import express from "express";
import path from "path";
import fs from "fs";
import fsPromises from "fs/promises";
import dotenv from "dotenv";
import multer from "multer";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

// Allow up to 50MB payloads for base64 file uploads fallback
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Ensure data and upload directories exist
const DATA_DIR = path.join(process.cwd(), "data");
const UPLOADS_DIR = path.join(DATA_DIR, "uploads");
const CURRICULUM_FILE = path.join(DATA_DIR, "curriculum.json");

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Multer Storage Configuration for PDF / File Streams
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || ".bin";
    const fileId = `file_${Date.now()}_${Math.random().toString(36).substring(2, 7)}${ext}`;
    cb(null, fileId);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB limit per PDF file
});

// Initialize Gemini client lazily/safely
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== "MY_GEMINI_API_KEY" && apiKey.trim() !== "") {
      aiClient = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
  }
  return aiClient;
}

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// GET /api/curriculum - Retrieve permanently stored curriculum
app.get("/api/curriculum", async (req, res) => {
  try {
    if (fs.existsSync(CURRICULUM_FILE)) {
      const data = await fsPromises.readFile(CURRICULUM_FILE, "utf-8");
      console.log("[SERVER] Loaded curriculum data from disk.");
      return res.json(JSON.parse(data));
    }
    console.log("[SERVER] No stored curriculum file found, returning empty object (client will fallback to defaults).");
    return res.json(null);
  } catch (error: any) {
    console.error("[SERVER ERROR] Failed reading curriculum file:", error);
    return res.status(500).json({ error: "Failed to read curriculum storage" });
  }
});

// POST /api/curriculum - Save curriculum permanently
app.post("/api/curriculum", async (req, res) => {
  try {
    const { courses } = req.body;
    if (!courses || !Array.isArray(courses)) {
      return res.status(400).json({ error: "Invalid courses payload" });
    }
    await fsPromises.writeFile(CURRICULUM_FILE, JSON.stringify(courses, null, 2), "utf-8");
    console.log(`[SERVER SUCCESS] Curriculum updated and saved permanently on server (${courses.length} courses).`);
    return res.json({ success: true, message: "Curriculum saved on server" });
  } catch (error: any) {
    console.error("[SERVER ERROR] Failed saving curriculum to disk:", error);
    return res.status(500).json({ error: "Failed to save curriculum to server" });
  }
});

// POST /api/upload - Permanent File Upload Endpoint (Handles both FormData & JSON)
app.post("/api/upload", upload.single("file"), async (req, res) => {
  try {
    console.log("[SERVER UPLOAD] Incoming upload request...");

    // 1. Check if multipart/form-data upload via multer
    if (req.file) {
      const fileId = req.file.filename;
      const fileUrl = `/api/files/${fileId}`;
      console.log(`[SERVER UPLOAD SUCCESS] Saved multipart file "${req.file.originalname}" (${req.file.size} bytes) -> ${fileUrl}`);
      return res.json({
        success: true,
        fileId,
        fileUrl,
        fileName: req.file.originalname,
        sizeBytes: req.file.size
      });
    }

    // 2. Fallback check for JSON body payload
    const { fileName, fileType, fileData } = req.body || {};
    if (fileName && fileData) {
      const ext = path.extname(fileName) || ".bin";
      const fileId = `file_${Date.now()}_${Math.random().toString(36).substring(2, 7)}${ext}`;
      const targetPath = path.join(UPLOADS_DIR, fileId);

      let buffer: Buffer;
      if (typeof fileData === "string" && fileData.startsWith("data:")) {
        const base64Part = fileData.split(",")[1];
        buffer = Buffer.from(base64Part, "base64");
      } else {
        buffer = Buffer.from(fileData, "utf-8");
      }

      await fsPromises.writeFile(targetPath, buffer);
      const fileUrl = `/api/files/${fileId}`;
      console.log(`[SERVER UPLOAD SUCCESS] Saved JSON file "${fileName}" (${buffer.length} bytes) -> ${fileUrl}`);

      return res.json({
        success: true,
        fileId,
        fileUrl,
        fileName,
        sizeBytes: buffer.length
      });
    }

    console.warn("[SERVER UPLOAD WARN] No file payload attached in request");
    return res.status(400).json({ error: "No file provided in request" });
  } catch (error: any) {
    console.error("[SERVER UPLOAD ERROR] Exception during file save:", error);
    return res.status(500).json({ error: "Server failed to save uploaded file", details: error.message });
  }
});

// GET /api/files/:fileId - Serve uploaded PDF / file permanently
app.get("/api/files/:fileId", (req, res) => {
  try {
    const { fileId } = req.params;
    const safeFileId = path.basename(fileId);
    const filePath = path.join(UPLOADS_DIR, safeFileId);

    if (!fs.existsSync(filePath)) {
      console.warn(`[SERVER FILE WARN] File not found: ${filePath}`);
      return res.status(404).send("File not found on server");
    }

    const ext = path.extname(safeFileId).toLowerCase();
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Accept-Ranges", "bytes");

    if (ext === ".pdf") {
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "inline");
    } else if (ext === ".png" || ext === ".jpg" || ext === ".jpeg") {
      res.setHeader("Content-Type", `image/${ext.replace(".", "")}`);
    } else if (ext === ".txt" || ext === ".md") {
      res.setHeader("Content-Type", "text/plain; charset=utf-8");
    } else {
      res.setHeader("Content-Type", "application/octet-stream");
    }

    console.log(`[SERVER FILE SERVED] Serving "${safeFileId}" to client viewer.`);
    return res.sendFile(filePath);
  } catch (error: any) {
    console.error("[SERVER FILE ERROR] Error serving file:", error);
    return res.status(500).send("Error serving file");
  }
});

// Configure Vite or Static files
async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }
}

setupVite().then(() => {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
});

