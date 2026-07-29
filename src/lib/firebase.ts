import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc, onSnapshot } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import config from "../../firebase-applet-config.json";

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(config) : getApp();

// Initialize Firestore Database using the specific databaseId from config if provided
export const db = config.firestoreDatabaseId && config.firestoreDatabaseId !== "(default)"
  ? getFirestore(app, config.firestoreDatabaseId)
  : getFirestore(app);

// Initialize Firebase Storage
export const storage = getStorage(app);

/**
 * Uploads a file to Firebase Storage (with fallback to server /api/upload-file endpoint if needed).
 * Returns the permanent public HTTP download URL along with file metadata.
 */
export async function uploadFileToCloud(
  file: File,
  folderPath: string = "study_materials"
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

  // Try uploading to Firebase Storage first
  try {
    const storageRef = ref(storage, storagePath);
    console.log("[FIREBASE STORAGE] Uploading file to Firebase Storage:", storagePath);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadUrl = await getDownloadURL(snapshot.ref);
    console.log("[FIREBASE STORAGE] File uploaded successfully! Public URL:", downloadUrl);
    return {
      url: downloadUrl,
      name: file.name,
      size: formattedSize,
      type: fileType
    };
  } catch (storageErr) {
    console.warn("[FIREBASE STORAGE] Direct upload error, falling back to backend cloud server upload:", storageErr);
  }

  // Fallback: Upload to shared cloud server endpoint (/api/upload-file)
  try {
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch("/api/upload-file", {
      method: "POST",
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Server returned status ${response.status}`);
    }

    const data = await response.json();
    if (data.url) {
      // Build absolute URL if needed so all devices can resolve it
      const fullUrl = data.url.startsWith("http") 
        ? data.url 
        : `${window.location.origin}${data.url.startsWith("/") ? "" : "/"}${data.url}`;

      console.log("[SERVER CLOUD UPLOAD] Uploaded to server storage! URL:", fullUrl);
      return {
        url: fullUrl,
        name: file.name,
        size: formattedSize,
        type: fileType
      };
    }
  } catch (serverErr) {
    console.error("[SERVER CLOUD UPLOAD] Server upload error:", serverErr);
  }

  // Final emergency fallback: convert file to clean data URL if small enough (< 2MB)
  if (file.size <= 2 * 1024 * 1024) {
    const base64Url = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
    return {
      url: base64Url,
      name: file.name,
      size: formattedSize,
      type: fileType
    };
  }

  throw new Error("Unable to upload file to cloud storage. Please check your internet connection.");
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
