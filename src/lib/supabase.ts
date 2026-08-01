import { createClient } from "@supabase/supabase-js";
import { logDiagnostic } from "./firebase";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-key"
);

export interface UploadMetadataParams {
  courseId?: string;
  semesterId?: string;
  subjectId?: string;
  unitId?: string;
}

export interface UploadResult {
  id: string;
  name: string;
  type: "pdf" | "ppt" | "image" | "doc" | "code" | "question" | "youtube" | "other";
  size: string;
  cloudPath: string;
  publicUrl: string;
  uploadedAt: string;
  courseId: string;
  semesterId: string;
  subjectId: string;
  unitId: string;
}

/**
 * Uploads a file directly to Supabase Storage bucket 'study-materials'.
 * Returns publicUrl and complete cloud metadata for shared cross-device access.
 */
export async function uploadFileToSupabaseStorage(
  file: File,
  contextParams: UploadMetadataParams = {},
  onProgress?: (percent: number, statusMsg: string) => void
): Promise<UploadResult> {
  const isInvalidUrl = !supabaseUrl || supabaseUrl.includes("placeholder") || supabaseUrl.includes("your-project");
  const isInvalidKey = !supabaseAnonKey || supabaseAnonKey.includes("placeholder") || supabaseAnonKey.includes("your-anon-key");

  if (isInvalidUrl || isInvalidKey) {
    throw new Error(
      "Supabase credentials are missing or set to placeholders! " +
      "Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment / Netlify environment variables."
    );
  }

  const formattedSize = file.size >= 1024 * 1024 
    ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
    : `${Math.round(file.size / 1024)} KB`;

  const ext = file.name.split('.').pop()?.toLowerCase() || '';
  let fileType: UploadResult["type"] = "other";
  if (ext === 'pdf') fileType = 'pdf';
  else if (['ppt', 'pptx', 'pps'].includes(ext)) fileType = 'ppt';
  else if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)) fileType = 'image';
  else if (['doc', 'docx', 'xls', 'xlsx', 'txt', 'md', 'rtf'].includes(ext)) fileType = 'doc';
  else if (['js', 'ts', 'jsx', 'tsx', 'py', 'java', 'cpp', 'c', 'html', 'css', 'json', 'sh', 'sql'].includes(ext)) fileType = 'code';

  const cleanFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const courseId = contextParams.courseId || "course";
  const semesterId = contextParams.semesterId || "sem";
  const subjectId = contextParams.subjectId || "subj";
  const unitId = contextParams.unitId || "unit";
  
  const cloudPath = `${courseId}/${semesterId}/${subjectId}/${unitId}/${Date.now()}_${cleanFileName}`;
  const fileId = "mat_sb_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7);

  logDiagnostic("info", `[Supabase Storage] Uploading "${file.name}" (${formattedSize}) to bucket 'study-materials' at '${cloudPath}'...`);
  if (onProgress) onProgress(20, `Uploading file to Supabase Storage bucket 'study-materials'...`);

  const { error } = await supabase.storage
    .from('study-materials')
    .upload(cloudPath, file, {
      cacheControl: '3600',
      upsert: true
    });

  if (error) {
    logDiagnostic("error", `[Supabase Upload Failed] ${error.message}`);
    const msg = error.message.toLowerCase();
    if (msg.includes("bucket not found")) {
      throw new Error("Supabase Storage bucket 'study-materials' does not exist! Go to Supabase Dashboard -> Storage -> Create a public bucket named 'study-materials'.");
    }
    if (msg.includes("row-level security") || msg.includes("policy") || msg.includes("unauthorized") || msg.includes("permission denied")) {
      throw new Error("Supabase RLS policy issue: Make sure bucket 'study-materials' is set to Public or has INSERT/SELECT policies enabled for anon users.");
    }
    throw new Error(`Supabase Storage Upload Failed: ${error.message}`);
  }

  if (onProgress) onProgress(85, `Uploaded! Generating public URL...`);

  const { data: publicUrlData } = supabase.storage
    .from('study-materials')
    .getPublicUrl(cloudPath);

  const publicUrl = publicUrlData.publicUrl;

  if (!publicUrl) {
    throw new Error("Could not retrieve public URL from Supabase Storage.");
  }

  logDiagnostic("success", `[Supabase Upload Success] Public URL: ${publicUrl}`);
  if (onProgress) onProgress(100, `Upload complete!`);

  return {
    id: fileId,
    name: file.name,
    type: fileType,
    size: formattedSize,
    cloudPath: cloudPath,
    publicUrl: publicUrl,
    uploadedAt: new Date().toISOString(),
    courseId: courseId,
    semesterId: semesterId,
    subjectId: subjectId,
    unitId: unitId
  };
}

/**
 * Removes file from Supabase Storage bucket 'study-materials'.
 */
export async function deleteFileFromSupabaseStorage(cloudPath: string): Promise<boolean> {
  if (!cloudPath) return false;
  try {
    logDiagnostic("info", `Deleting file '${cloudPath}' from Supabase Storage...`);
    const { error } = await supabase.storage.from('study-materials').remove([cloudPath]);
    if (error) {
      logDiagnostic("warn", `[Supabase Delete Warning] ${error.message}`);
      return false;
    }
    logDiagnostic("success", `[Supabase Delete Success] File '${cloudPath}' deleted from storage.`);
    return true;
  } catch (err: any) {
    logDiagnostic("warn", `[Supabase Delete Error] ${err?.message || err}`);
    return false;
  }
}
