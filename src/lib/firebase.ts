import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc, onSnapshot } from "firebase/firestore";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import config from "../../firebase-applet-config.json";

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(config) : getApp();

// Initialize Firestore Database using the specific databaseId from config if provided
const targetDbId = config.firestoreDatabaseId && config.firestoreDatabaseId !== "(default)"
  ? config.firestoreDatabaseId
  : "(default)";

export const db = targetDbId !== "(default)"
  ? getFirestore(app, targetDbId)
  : getFirestore(app);

// Initialize Firebase Storage with explicit bucket URL
const storageBucketName = config.storageBucket || "solid-aquifer-j5fd2.firebasestorage.app";
export const storage = getStorage(
  app, 
  storageBucketName.startsWith("gs://") ? storageBucketName : `gs://${storageBucketName}`
);

// Diagnostic State Types
export interface DiagnosticLog {
  id: string;
  time: string;
  message: string;
  level: "info" | "success" | "warn" | "error";
}

export interface FirebaseDiagnostics {
  projectId: string;
  databaseId: string;
  storageBucket: string;
  readStatus: "SUCCESS" | "FAILED" | "CONNECTING" | "IDLE";
  readSource: string;
  readDocPath: string;
  readCourseCount: number;
  lastReadTime: string;
  readError: string | null;
  storageStatus: "SUCCESS" | "FAILED" | "FIRESTORE_DOC" | "IDLE";
  storageUrl: string | null;
  storageError: string | null;
  writeStatus: "SUCCESS" | "FAILED" | "IDLE";
  writeDocPath: string;
  writeTimestamp: string | null;
  writeError: string | null;
  isFallbackActive: boolean;
  logs: DiagnosticLog[];
}

let diagnosticsState: FirebaseDiagnostics = {
  projectId: config.projectId || "solid-aquifer-j5fd2",
  databaseId: targetDbId,
  storageBucket: storageBucketName,
  readStatus: "IDLE",
  readSource: "None",
  readDocPath: "courses/main",
  readCourseCount: 0,
  lastReadTime: "Never",
  readError: null,
  storageStatus: "IDLE",
  storageUrl: null,
  storageError: null,
  writeStatus: "IDLE",
  writeDocPath: "courses/main",
  writeTimestamp: null,
  writeError: null,
  isFallbackActive: false,
  logs: []
};

type DiagnosticsListener = (diag: FirebaseDiagnostics) => void;
const listeners = new Set<DiagnosticsListener>();

export function subscribeDiagnostics(listener: DiagnosticsListener): () => void {
  listeners.add(listener);
  listener({ ...diagnosticsState });
  return () => {
    listeners.delete(listener);
  };
}

function notifyListeners() {
  const copy = { ...diagnosticsState, logs: [...diagnosticsState.logs] };
  listeners.forEach(fn => fn(copy));
}

export function logDiagnostic(level: "info" | "success" | "warn" | "error", message: string) {
  const time = new Date().toLocaleTimeString();
  const logItem: DiagnosticLog = {
    id: "log_" + Date.now() + "_" + Math.random().toString(36).substr(2, 4),
    time,
    message,
    level
  };
  diagnosticsState.logs = [logItem, ...diagnosticsState.logs.slice(0, 49)];
  console.log(`[FIREBASE DIAGNOSTIC ${level.toUpperCase()}] ${message}`);
  notifyListeners();
}

function updateDiagnostics(partial: Partial<FirebaseDiagnostics>) {
  diagnosticsState = { ...diagnosticsState, ...partial };
  notifyListeners();
}

export function getDiagnosticsState(): FirebaseDiagnostics {
  return { ...diagnosticsState };
}

/**
 * Uploads a file to Firebase Storage or falls back to Firestore document storage.
 * Guarantees cross-device availability.
 */
export async function uploadFileToCloud(
  file: File,
  folderPath: string = "study_materials",
  onProgress?: (percent: number, statusMsg: string) => void
): Promise<{ url: string; name: string; size: string; type: string }> {
  const formattedSize = file.size > 1024 * 1024 
    ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
    : `${Math.round(file.size / 1024)} KB`;

  const extension = file.name.split('.').pop()?.toLowerCase() || '';
  let fileType = 'doc';
  if (extension === 'pdf') fileType = 'pdf';
  else if (['ppt', 'pptx'].includes(extension)) fileType = 'ppt';
  else if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension)) fileType = 'image';
  else if (['js', 'ts', 'py', 'java', 'cpp', 'c', 'html', 'css', 'json'].includes(extension)) fileType = 'code';

  const cleanFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const storagePath = `${folderPath}/${Date.now()}_${cleanFileName}`;
  const fileId = "mat_file_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7);

  logDiagnostic("info", `Starting cloud upload for "${file.name}" (${formattedSize})...`);

  // 1. Attempt upload to Firebase Storage with a 6-second timeout
  try {
    if (onProgress) onProgress(10, "Connecting to Firebase Storage...");
    const storageRef = ref(storage, storagePath);
    
    const downloadUrl = await new Promise<string>((resolve, reject) => {
      let isSettled = false;
      const timeoutId = setTimeout(() => {
        if (!isSettled) {
          isSettled = true;
          reject(new Error("Firebase Storage upload timed out after 6 seconds"));
        }
      }, 6000);

      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          if (isSettled) return;
          const pct = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          if (onProgress) onProgress(Math.min(pct, 95), `Uploading to Firebase Storage (${pct}%)...`);
        },
        (err) => {
          if (!isSettled) {
            isSettled = true;
            clearTimeout(timeoutId);
            reject(err);
          }
        },
        async () => {
          if (!isSettled) {
            isSettled = true;
            clearTimeout(timeoutId);
            try {
              const url = await getDownloadURL(uploadTask.snapshot.ref);
              resolve(url);
            } catch (e) {
              reject(e);
            }
          }
        }
      );
    });

    updateDiagnostics({
      storageStatus: "SUCCESS",
      storageUrl: downloadUrl,
      storageError: null
    });
    logDiagnostic("success", `[Firebase Storage] Uploaded "${file.name}" successfully! URL: ${downloadUrl}`);
    if (onProgress) onProgress(100, "Storage upload complete!");

    return {
      url: downloadUrl,
      name: file.name,
      size: formattedSize,
      type: fileType
    };
  } catch (storageErr: any) {
    const errMsg = storageErr?.message || String(storageErr);
    updateDiagnostics({
      storageStatus: "FAILED",
      storageError: errMsg,
      storageUrl: null
    });
    logDiagnostic("warn", `[Firebase Storage] Storage upload failed (${errMsg}). Saving to Firestore collection 'uploaded_files'...`);
  }

  // 2. Fallback: Save file document directly to Firestore collection 'uploaded_files'
  try {
    if (onProgress) onProgress(60, "Storing file binary into Firestore cloud database...");
    logDiagnostic("info", `Converting "${file.name}" to base64 Data URL for Firestore collection 'uploaded_files'...`);
    
    const base64Url = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error("Failed to read file contents"));
      reader.readAsDataURL(file);
    });

    const fileDocRef = doc(db, "uploaded_files", fileId);
    const filePayload = {
      id: fileId,
      name: file.name,
      size: formattedSize,
      type: fileType,
      dataUrl: base64Url,
      uploadedAt: new Date().toISOString()
    };

    await setDoc(fileDocRef, filePayload);

    const cloudFileRefUrl = `firestore_file://${fileId}`;
    updateDiagnostics({
      storageStatus: "FIRESTORE_DOC",
      storageUrl: cloudFileRefUrl
    });
    logDiagnostic("success", `[Firestore Cloud] Uploaded file document to 'uploaded_files/${fileId}'!`);
    if (onProgress) onProgress(100, "Firestore file upload complete!");

    return {
      url: cloudFileRefUrl,
      name: file.name,
      size: formattedSize,
      type: fileType
    };
  } catch (firestoreFileErr: any) {
    const errMsg = firestoreFileErr?.message || String(firestoreFileErr);
    logDiagnostic("error", `[Cloud Upload CRITICAL FAIL] Failed saving file to cloud: ${errMsg}`);
    throw new Error(`Upload to Cloud failed: ${errMsg}`);
  }
}

/**
 * Saves the entire curriculum and materials tree to Firebase Firestore.
 */
export async function saveCoursesToFirestore(coursesData: any[]): Promise<boolean> {
  logDiagnostic("info", `Writing curriculum payload (${coursesData.length} courses) to Firestore 'courses/main'...`);
  try {
    const courseDocRef = doc(db, "courses", "main");
    const payload = {
      coursesData,
      updatedAt: new Date().toISOString()
    };

    await setDoc(courseDocRef, payload);

    updateDiagnostics({
      writeStatus: "SUCCESS",
      writeDocPath: "courses/main",
      writeTimestamp: payload.updatedAt,
      writeError: null
    });
    logDiagnostic("success", `[Firestore Cloud] Saved curriculum to 'courses/main' at ${payload.updatedAt}!`);
    return true;
  } catch (err: any) {
    const errMsg = err?.message || String(err);
    updateDiagnostics({
      writeStatus: "FAILED",
      writeError: errMsg
    });
    logDiagnostic("error", `[Firestore Cloud ERROR] Failed writing to 'courses/main': ${errMsg}`);
    throw new Error(`Firestore Save Failed: ${errMsg}`);
  }
}

/**
 * Loads courses from Firebase Firestore.
 */
export async function loadCoursesFromFirestore(): Promise<any[] | null> {
  logDiagnostic("info", "Loading curriculum from Firestore 'courses/main'...");
  try {
    const courseDocRef = doc(db, "courses", "main");
    const docSnap = await getDoc(courseDocRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data && Array.isArray(data.coursesData) && data.coursesData.length > 0) {
        updateDiagnostics({
          readStatus: "SUCCESS",
          readSource: "Firestore Direct Fetch",
          readDocPath: "courses/main",
          readCourseCount: data.coursesData.length,
          lastReadTime: new Date().toLocaleTimeString(),
          readError: null
        });
        logDiagnostic("success", `[Firestore Cloud] Loaded ${data.coursesData.length} courses from 'courses/main'!`);
        return data.coursesData;
      }
    }
  } catch (err: any) {
    const errMsg = err?.message || String(err);
    updateDiagnostics({
      readStatus: "FAILED",
      readError: errMsg
    });
    logDiagnostic("error", `[Firestore Cloud Read Error] ${errMsg}`);
  }
  return null;
}

/**
 * Real-time listener for Firestore courses updates across all devices.
 */
export function subscribeCoursesFromFirestore(callback: (coursesData: any[]) => void): () => void {
  logDiagnostic("info", "Attaching real-time listener to Firestore 'courses/main'...");
  try {
    const courseDocRef = doc(db, "courses", "main");
    const unsubscribe = onSnapshot(courseDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data && Array.isArray(data.coursesData) && data.coursesData.length > 0) {
          updateDiagnostics({
            readStatus: "SUCCESS",
            readSource: "Firestore Cloud Realtime Listener",
            readDocPath: "courses/main",
            readCourseCount: data.coursesData.length,
            lastReadTime: new Date().toLocaleTimeString(),
            readError: null
          });
          logDiagnostic("success", `[Firestore Realtime] Live curriculum update (${data.coursesData.length} courses) received!`);
          callback(data.coursesData);
        }
      }
    }, (err) => {
      const errMsg = err?.message || String(err);
      updateDiagnostics({
        readStatus: "FAILED",
        readError: errMsg
      });
      logDiagnostic("error", `[Firestore Realtime ERROR] ${errMsg}`);
    });
    return unsubscribe;
  } catch (err: any) {
    const errMsg = err?.message || String(err);
    logDiagnostic("error", `[Firestore Subscription Failed] ${errMsg}`);
    return () => {};
  }
}

/**
 * Retrieves file binary or data URL from Firestore uploaded_files if needed.
 */
export async function getFileContentFromCloud(fileUrl: string): Promise<string> {
  if (!fileUrl) return "";
  if (fileUrl.startsWith("firestore_file://")) {
    const fileId = fileUrl.replace("firestore_file://", "");
    logDiagnostic("info", `Fetching content for file document '${fileId}' from Firestore 'uploaded_files'...`);
    try {
      const fileDocSnap = await getDoc(doc(db, "uploaded_files", fileId));
      if (fileDocSnap.exists()) {
        const fileData = fileDocSnap.data();
        if (fileData && fileData.dataUrl) {
          logDiagnostic("success", `[Firestore Cloud] Retrieved binary data for 'uploaded_files/${fileId}'!`);
          return fileData.dataUrl;
        }
      }
    } catch (err: any) {
      logDiagnostic("error", `[Firestore File Read Error] ${err?.message || err}`);
    }
  }
  return fileUrl;
}
