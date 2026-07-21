import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

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
function isStudyRelated(query: string): boolean {
  if (!query) return true;
  const q = query.toLowerCase().trim();
  
  // Allow short testing queries (3 words or less)
  if (q.split(/\s+/).length <= 3) {
    return true;
  }

  // Allow greetings and generic tutor inquiries or meta-discussions
  const allowedGeneral = [
    "hello", "hi", "hey", "who are you", "what is your name", "who created you", 
    "help", "how are you", "whats up", "greetings", "good morning", "good afternoon", "good evening",
    "bunny", "tutor", "respond", "responding", "working", "test", "testing", "umme", "balaji"
  ];
  if (allowedGeneral.some(g => q.includes(g))) {
    return true;
  }
  
  // High-confidence academic/study related keywords
  const studyKeywords = [
    "explain", "what is", "how to", "code", "programming", "oop", "class", "object", "interface",
    "loop", "variable", "database", "sql", "html", "css", "java", "python", "c++", "c language",
    "syllabus", "semester", "exam", "question", "test", "study", "learn", "concept", "define",
    "algorithm", "data structure", "array", "pointer", "function", "recursion", "binary",
    "compiler", "operating system", "network", "software", "hardware", "cpu", "memory",
    "polymorphism", "inheritance", "encapsulation", "abstraction", "engineering", "science",
    "math", "bca", "curriculum", "unit", "practical", "theory", "assignment", "discrete",
    "structures", "relations", "venn", "logic", "counting", "matrix", "matrices", "graph",
    "tree", "proof", "derivatives", "integral", "limit", "calculus", "vector", "probability",
    "statistics", "regression", "ml", "machine learning", "ai", "artificial intelligence",
    "neural", "network", "deep learning", "nlp", "predictive", "viz", "visualization",
    "data science", "r prog", "r programming", "capstone", "project", "cyber security",
    "cryptography", "cloud", "mobile", "shell", "unix", "linux", "git", "github", "vulnerability",
    "threat", "forensics", "academic", "class", "school", "college", "university", "homework",
    "syllabus", "paper", "book", "lecture", "note", "notes", "quiz"
  ];
  
  if (studyKeywords.some(kw => q.includes(kw))) {
    return true;
  }
  
  // Check if they are asking an explicit question with question words that contains common educational terms
  const questionWords = ["why", "how", "what", "where", "when", "who", "which", "can you"];
  const educationalNouns = ["system", "program", "data", "file", "network", "design", "model", "analysis", "method", "term", "process", "concept", "structure", "value", "theory", "problem"];
  if (questionWords.some(qw => q.startsWith(qw)) && educationalNouns.some(en => q.includes(en))) {
    return true;
  }
  
  return false;
}

app.post("/api/gemini/chat", async (req, res) => {
  const { messages, currentTopic } = req.body;
  
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Messages array is required" });
  }

  // Retrieve the latest user message to run the study check
  const userMessages = messages.filter((m: any) => m.role === "user");
  const lastUserMessage = userMessages[userMessages.length - 1];
  const latestQuery = lastUserMessage ? lastUserMessage.text : "";

  // If the query is not study related, intercept with the Bunny Tutor studies-only response
  if (latestQuery && !isStudyRelated(latestQuery)) {
    return res.json({
      text: "I am Bunny Tutor, your dedicated academic study coach! 🥕 I only support study-related topics, computer science, programming, syllabus concepts, and exam preparation. Let's get back to learning! 📚 Please ask me an academic or coding question! 🐾"
    });
  }

  const client = getGeminiClient();
  if (!client) {
    // Return simulated cozy response from Bunny Tutor in case API key is missing
    const responses = [
      "Hello study companion! Welcome to the Burrow. 🥕 I am Bunny Tutor, your academic rabbit guide! I'm here to help you dig deeper into computer science. What can I help you learn today?",
      "An excellent question! In OOP, everything is structured around classes and objects, just like every rabbit in our burrow belongs to a species (class), but Bunny Tutor and other rabbits are individual instances (objects)! 🐾",
      "That is a wonderful thought! Remember that learning is like burrowing—it's done one hop at a time. Do you want to try some interactive questions or see some code examples? 📚",
      "Hop to it! Let's examine this carefully. Abstraction means hiding the internal details and showing only what is necessary, just like you enjoy a delicious crunchy carrot without needing to understand soil chemistry! 🥕"
    ];
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    return res.json({ text: randomResponse });
  }

  try {
    const formattedContents = messages.map((m: any) => ({
      role: m.role === "user" ? ("user" as const) : ("model" as const),
      parts: [{ text: m.text }],
    }));

    const response = await client.models.generateContent({
      model: "gemini-3.6-flash",
      contents: formattedContents,
      config: {
        systemInstruction: `You are Bunny Tutor, the academic "Read Rabbit" tutor in "The Burrow of Knowledge".
You are an expert computer science teacher, but you speak in a cozy, encouraging, charming, and warm rabbit persona.
You refer to studying as "burrowing" and students as "little bunnies" or "study companions".
You use words like "hop to it!", "nibbling on concepts", "digging deeper", and make occasional references to carrots, clover, and cozy nooks.
CRITICAL MANDATE: You ONLY answer questions related to studies, computer science, academics, syllabus, exams, or programming.
If the student asks about non-study related topics (such as politics, movies, cooking, sports, pop culture, random jokes, or personal off-topic questions), you MUST politely refuse and state that you are Bunny Tutor and only support study-related topics.
The student is currently studying: ${currentTopic || "General Computer Science"}.
Keep your responses relatively brief (1-3 paragraphs), structured, encouraging, and clear. Help them master their exams, concepts, or code.`,
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    // Fallback to simulated cozy response from Bunny Tutor in case API key is missing or errors
    const responses = [
      "Hello study companion! Welcome to the Burrow. 🥕 I am Bunny Tutor, your academic rabbit guide! I'm here to help you dig deeper into computer science. What can I help you learn today?",
      "An excellent question! In OOP, everything is structured around classes and objects, just like every rabbit in our burrow belongs to a species (class), but Bunny Tutor and other rabbits are individual instances (objects)! 🐾",
      "That is a wonderful thought! Remember that learning is like burrowing—it's done one hop at a time. Do you want to try some interactive questions or see some code examples? 📚",
      "Hop to it! Let's examine this carefully. Abstraction means hiding the internal details and showing only what is necessary, just like you enjoy a delicious crunchy carrot without needing to understand soil chemistry! 🥕"
    ];
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    res.json({ text: randomResponse });
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
