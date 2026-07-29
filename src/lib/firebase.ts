import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc, onSnapshot } from "firebase/firestore";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import config from "../../firebase-applet-config.json";

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(config) : getApp();

// Initialize Firestore Database using the specific databaseId from config if provided
export const db = config.firestoreDatabaseId && config.firestoreDatabaseId !== "(default)"
  ? getFirestore(app, config.firestoreDatabaseId)
  : getFirestore(app);

// Initialize Firebase Storage with explicit bucket URL
const storageBucketName = config.storageBucket || "solid-aquifer-j5fd2.firebasestorage.app";
export const storage = getStorage(
  app, 
  storageBucketName.startsWith("gs://") ? storageBucketName : `gs://${storageBucketName}`
);

/**
 * Uploads a file to Firebase Storage with progress tracking, timeouts, and fallbacks.
 * Returns permanent URL and metadata for cloud sync across devices.
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

  // 1. Attempt upload to Firebase Storage with a strict 7-second timeout
  try {
    if (onProgress) onProgress(5, "Connecting to Firebase Storage...");
    const storageRef = ref(storage, storagePath);
    
    const downloadUrl = await new Promise<string>((resolve, reject) => {
      let isSettled = false;
      const timeoutId = setTimeout(() => {
        if (!isSettled) {
          isSettled = true;
          reject(new Error("Firebase Storage upload timed out after 7 seconds"));
        }
      }, 7000);

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

    console.log("[FIREBASE STORAGE] Upload successful! URL:", downloadUrl);
    if (onProgress) onProgress(100, "Upload complete!");
    return {
      url: downloadUrl,
      name: file.name,
      size: formattedSize,
      type: fileType
    };
  } catch (storageErr: any) {
    console.warn("[FIREBASE STORAGE WARN] Direct Firebase Storage failed or timed out:", storageErr?.message || storageErr);
  }

  // 2. Fallback: Upload to backend server endpoint (/api/upload-file or /api/upload)
  try {
    if (onProgress) onProgress(40, "Uploading via backend cloud server...");
    const controller = new AbortController();
    const serverTimeout = setTimeout(() => controller.abort(), 6000);

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload-file", {
      method: "POST",
      body: formData,
      signal: controller.signal
    });
    clearTimeout(serverTimeout);

    if (response.ok) {
      const data = await response.json();
      const rawUrl = data.url || data.fileUrl;
      if (rawUrl) {
        const fullUrl = rawUrl.startsWith("http") 
          ? rawUrl 
          : `${window.location.origin}${rawUrl.startsWith("/") ? "" : "/"}${rawUrl}`;
        console.log("[SERVER CLOUD UPLOAD] Server upload success! URL:", fullUrl);
        if (onProgress) onProgress(100, "Upload complete!");
        return {
          url: fullUrl,
          name: file.name,
          size: formattedSize,
          type: fileType
        };
      }
    }
  } catch (serverErr: any) {
    console.warn("[SERVER UPLOAD WARN] Backend upload failed or unavailable:", serverErr?.message || serverErr);
  }

  // 3. Fallback: Base64 Data URL (Self-contained in Firestore for cross-device access)
  try {
    if (onProgress) onProgress(70, "Processing file for cross-device cloud sync...");
    console.log("[DATA URL FALLBACK] Converting file to Data URL for cloud store...");
    const base64Url = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error("Failed to read file contents"));
      reader.readAsDataURL(file);
    });

    if (onProgress) onProgress(100, "Processing complete!");
    return {
      url: base64Url,
      name: file.name,
      size: formattedSize,
      type: fileType
    };
  } catch (base64Err: any) {
    console.error("[CLOUD UPLOAD ERROR] All storage methods failed:", base64Err);
    throw new Error(`Failed to upload file: ${base64Err.message || "Unknown error"}`);
  }
}

/**
 * Saves the entire curriculum and materials tree to Firebase Firestore.
 */
export async function saveCoursesToFirestore(coursesData: any[]): Promise<boolean> {
  try {
    const courseDocRef = doc(db, "courses", "main");
    await setDoc(courseDocRef, {
      coursesData,
      updatedAt: new Date().toISOString()
    });
    console.log("[FIRESTORE] Saved courses and study materials to cloud database!");

    // Also sync with server backend JSON for legacy endpoints
    fetch("/api/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(coursesData)
    }).catch(err => console.warn("[SERVER SYNC] Fallback sync warning:", err));

    return true;
  } catch (err) {
    console.error("[FIRESTORE] Error saving to Firestore:", err);
    // Fallback to server endpoint
    try {
      const res = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(coursesData)
      });
      return res.ok;
    } catch (e) {
      console.error("[SERVER] Error saving to server fallback:", e);
      return false;
    }
  }
}

/**
 * Loads courses from Firebase Firestore.
 */
export async function loadCoursesFromFirestore(): Promise<any[] | null> {
  try {
    const courseDocRef = doc(db, "courses", "main");
    const docSnap = await getDoc(courseDocRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data && Array.isArray(data.coursesData) && data.coursesData.length > 0) {
        console.log("[FIRESTORE] Loaded courses from Firebase Firestore!");
        return data.coursesData;
      }
    }
  } catch (err) {
    console.warn("[FIRESTORE] Error reading from Firestore:", err);
  }
  return null;
}

/**
 * Real-time listener for Firestore courses updates across all devices.
 */
export function subscribeCoursesFromFirestore(callback: (coursesData: any[]) => void): () => void {
  try {
    const courseDocRef = doc(db, "courses", "main");
    const unsubscribe = onSnapshot(courseDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data && Array.isArray(data.coursesData) && data.coursesData.length > 0) {
          console.log("[FIRESTORE REALTIME] Received updated curriculum data from cloud!");
          callback(data.coursesData);
        }
      }
    }, (err) => {
      console.warn("[FIRESTORE REALTIME] Snapshot subscription error:", err);
    });
    return unsubscribe;
  } catch (err) {
    console.warn("[FIRESTORE REALTIME] Error setting up listener:", err);
    return () => {};
  }
}
