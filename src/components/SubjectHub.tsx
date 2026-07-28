import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Subject, Unit, StudyMaterial, YouTubeReference } from "../types";
import { 
  ChevronRight, 
  BookOpen, 
  Code, 
  Award, 
  HelpCircle, 
  Play, 
  Sparkles, 
  ChevronDown, 
  FileText, 
  Terminal, 
  CheckCircle,
  Clock,
  ArrowLeft,
  X,
  MessageSquare,
  User,
  ShieldCheck,
  RefreshCw,
  Plus,
  Trash2,
  Upload,
  Download,
  Eye,
  Copy,
  Check,
  ExternalLink,
  Save,
  CloudUpload,
  Youtube,
  Video,
  Image as ImageIcon,
  Presentation,
  FileSpreadsheet
} from "lucide-react";

interface SubjectHubProps {
  courseName: string;
  semesterName: string;
  subject: Subject;
  isAdmin: boolean;
  onBackToSubjects: () => void;
  onUpdateSubject: (updatedSubject: Subject) => void;
}

function getYouTubeVideoId(url: string): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

export default function SubjectHub({
  courseName,
  semesterName,
  subject,
  isAdmin,
  onBackToSubjects,
  onUpdateSubject,
}: SubjectHubProps) {
  const [activeTab, setActiveTab] = useState<"syllabus" | "materials" | "quiz">("syllabus");
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);

  // Material Details modal
  const [activeMaterial, setActiveMaterial] = useState<StudyMaterial | null>(null);
  const [copied, setCopied] = useState(false);

  // Practice Quiz / Flashcard State
  const [isPlayingQuiz, setIsPlayingQuiz] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);

  // Unit Sub-Tab State (notes | questions | youtube)
  const [unitActiveTab, setUnitActiveTab] = useState<Record<string, "notes" | "questions" | "youtube">>({});
  
  // YouTube Form State
  const [ytTitle, setYtTitle] = useState("");
  const [ytUrl, setYtUrl] = useState("");

  // Important Question Form State
  const [qText, setQText] = useState("");
  const [qAnswer, setQAnswer] = useState("");
  const [qImportance, setQImportance] = useState<"High" | "Medium" | "Low">("High");
  const [openQuestionId, setOpenQuestionId] = useState<string | null>(null);

  // In-App YouTube Video Player state
  const [activeYtVideo, setActiveYtVideo] = useState<{ id: string; title: string; url: string; ytId: string | null; channelName?: string; unitNumber?: string } | null>(null);
  const [ytPlayerNotes, setYtPlayerNotes] = useState("");
  const [ytNotesSaved, setYtNotesSaved] = useState(false);

  const openYtVideo = (yt: YouTubeReference, unitNumber?: string) => {
    const ytId = getYouTubeVideoId(yt.url);
    window.history.pushState({ subModal: "youtube", ytId: yt.id }, "");
    setActiveYtVideo({ ...yt, ytId, unitNumber });
    setYtPlayerNotes("");
    setYtNotesSaved(false);
  };

  const closeYtVideo = () => {
    setActiveYtVideo(null);
  };

  // History sync helper for SubjectHub modals
  const openMaterial = (mat: StudyMaterial) => {
    window.history.pushState({ subModal: "material", matId: mat.id }, "");
    setActiveMaterial(mat);
  };

  const closeMaterial = () => {
    setActiveMaterial(null);
  };

  const openUnit = (unit: Unit) => {
    window.history.pushState({ subModal: "unit", unitId: unit.id }, "");
    setSelectedUnit(unit);
  };

  const closeUnit = () => {
    setSelectedUnit(null);
  };

  // Close active modal on browser Back button
  useEffect(() => {
    const handleHubPopState = () => {
      if (activeYtVideo) {
        setActiveYtVideo(null);
      } else if (activeMaterial) {
        setActiveMaterial(null);
      } else if (selectedUnit) {
        setSelectedUnit(null);
      } else if (isPlayingQuiz) {
        setIsPlayingQuiz(false);
      }
    };

    window.addEventListener("popstate", handleHubPopState);
    return () => window.removeEventListener("popstate", handleHubPopState);
  }, [activeYtVideo, activeMaterial, selectedUnit, isPlayingQuiz]);

  // Download File Helper
  const handleDownloadFile = async (material: StudyMaterial) => {
    try {
      if (material.details && (material.details.startsWith("/api/files/") || material.details.startsWith("http"))) {
        const res = await fetch(material.details);
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = material.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      } else if (material.details && material.details.startsWith("data:")) {
        const link = document.createElement("a");
        link.href = material.details;
        link.download = material.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        const blob = new Blob([material.details || ""], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = material.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      }
    } catch (err) {
      console.error("Failed to download file:", err);
      if (material.details?.startsWith("/api/files/")) {
        window.open(material.details, "_blank");
      } else {
        alert(`Could not trigger automated download for "${material.name}".`);
      }
    }
  };

  // Copy Content Helper
  const handleCopyContent = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Admin File & Notes Upload / Management State
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");
  const [adminNoteTitle, setAdminNoteTitle] = useState("");
  const [adminNoteContent, setAdminNoteContent] = useState("");
  const [adminNoteType, setAdminNoteType] = useState<"pdf" | "code" | "question">("pdf");
  const [adminUploadMode, setAdminUploadMode] = useState<"file" | "write">("file");

  // Cloud Save State & Permanent Storage Handler
  const [isSavingWeb, setIsSavingWeb] = useState(false);
  const [webSaveSuccess, setWebSaveSuccess] = useState(false);
  const [lastUploadedMaterialName, setLastUploadedMaterialName] = useState<string | null>(null);

  const handleManualSaveToWeb = async (fileName?: string) => {
    setIsSavingWeb(true);
    try {
      // 1. Flush subject state to App
      onUpdateSubject(subject);

      // 2. Direct POST to /api/curriculum server endpoint to guarantee instant storage
      if ((window as any).__CURRICULUM_COURSES__) {
        await fetch("/api/curriculum", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify((window as any).__CURRICULUM_COURSES__)
        }).catch(() => {});
      }

      setWebSaveSuccess(true);
      if (fileName) {
        setLastUploadedMaterialName(fileName);
      }
      setTimeout(() => setWebSaveSuccess(false), 5000);
    } catch (err) {
      console.warn("[SAVE ERROR]", err);
    } finally {
      setIsSavingWeb(false);
    }
  };

  const handleDeleteUnitMaterial = (unitId: string, materialId: string) => {
    if (!window.confirm("Are you sure you want to delete this file/note from this unit?")) return;
    const updatedUnits = subject.units.map(unit => {
      if (unit.id !== unitId) return unit;
      return {
        ...unit,
        materials: (unit.materials || []).filter(m => m.id !== materialId)
      };
    });
    onUpdateSubject({
      ...subject,
      units: updatedUnits
    });
  };

  const handleDeleteSubjectMaterial = (materialId: string) => {
    if (!window.confirm("Are you sure you want to delete this file/note from this subject?")) return;
    onUpdateSubject({
      ...subject,
      materials: (subject.materials || []).filter(m => m.id !== materialId)
    });
  };

  const handleAddYoutubeLink = (unitId: string) => {
    if (!ytUrl.trim()) return;
    const newYt = {
      id: "yt_" + Date.now(),
      title: ytTitle.trim() || "YouTube Video Reference",
      url: ytUrl.trim(),
      channelName: "Academic Lecture Video"
    };
    const updatedUnits = subject.units.map(u => {
      if (u.id !== unitId) return u;
      return {
        ...u,
        youtubeLinks: [...(u.youtubeLinks || []), newYt]
      };
    });
    onUpdateSubject({ ...subject, units: updatedUnits });
    setYtTitle("");
    setYtUrl("");
  };

  const handleDeleteYoutubeLink = (unitId: string, ytId: string) => {
    const updatedUnits = subject.units.map(u => {
      if (u.id !== unitId) return u;
      return {
        ...u,
        youtubeLinks: (u.youtubeLinks || []).filter(y => y.id !== ytId)
      };
    });
    onUpdateSubject({ ...subject, units: updatedUnits });
  };

  const handleAddImportantQuestion = (unitId: string) => {
    if (!qText.trim()) return;
    const newQ = {
      id: "q_" + Date.now(),
      question: qText.trim(),
      answer: qAnswer.trim() || "Refer to unit study notes for step-by-step solution.",
      importance: qImportance,
      yearTag: "High Yield Exam Topic"
    };
    const updatedUnits = subject.units.map(u => {
      if (u.id !== unitId) return u;
      return {
        ...u,
        importantQuestions: [...(u.importantQuestions || []), newQ]
      };
    });
    onUpdateSubject({ ...subject, units: updatedUnits });
    setQText("");
    setQAnswer("");
  };

  const handleDeleteImportantQuestion = (unitId: string, qId: string) => {
    const updatedUnits = subject.units.map(u => {
      if (u.id !== unitId) return u;
      return {
        ...u,
        importantQuestions: (u.importantQuestions || []).filter(q => q.id !== qId)
      };
    });
    onUpdateSubject({ ...subject, units: updatedUnits });
  };

  const handleProcessFile = async (file: File, targetUnitId: string | null) => {
    setUploadError("");
    setUploadSuccess("");
    if (!file) {
      console.error("[UPLOAD ERROR] No file provided to handleProcessFile");
      return;
    }

    console.log(`[UPLOAD FILE SELECTED] Name: ${file.name}, Size: ${file.size} bytes, Type: ${file.type}`);

    let sizeStr = "";
    if (file.size >= 1024 * 1024) {
      sizeStr = (file.size / (1024 * 1024)).toFixed(1) + " MB";
    } else {
      sizeStr = (file.size / 1024).toFixed(0) + " KB";
    }

    const name = file.name;
    const ext = name.split(".").pop()?.toLowerCase() || "";
    let type: StudyMaterial["type"] = "other";
    if (ext === "pdf") {
      type = "pdf";
    } else if (["ppt", "pptx", "pps"].includes(ext)) {
      type = "ppt";
    } else if (["png", "jpg", "jpeg", "webp", "gif", "svg", "bmp"].includes(ext)) {
      type = "image";
    } else if (["doc", "docx", "xls", "xlsx", "txt", "md", "rtf", "odt"].includes(ext)) {
      type = "doc";
    } else if (["js", "ts", "jsx", "tsx", "py", "java", "cpp", "c", "cs", "html", "css", "json", "sql", "sh"].includes(ext)) {
      type = "code";
    }

    setUploadSuccess(`[Uploading] Processing "${name}" (${sizeStr})...`);

    let fileUrl = "";
    let fileId = "";

    try {
      console.log(`[PDF UPLOAD STEP 2: Server API Request] POSTing /api/upload...`);
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const uploadData = await res.json();
        if (uploadData.fileUrl) {
          fileUrl = uploadData.fileUrl;
          fileId = uploadData.fileId;
          console.log("[PDF UPLOAD SUCCESS] Server saved file at:", fileUrl);
        }
      } else {
        console.warn(`[PDF UPLOAD WARN] Server endpoint returned HTTP ${res.status}. Trying JSON payload server upload...`);
      }
    } catch (apiErr) {
      console.warn("[PDF UPLOAD WARN] Server multipart endpoint error. Trying JSON payload fallback...", apiErr);
    }

    // Step 3: Base64 JSON POST fallback to server endpoint to guarantee persistence on web
    if (!fileUrl) {
      try {
        console.log("[PDF UPLOAD STEP 3: Base64 JSON Upload to Server] Converting file to data URL...");
        const base64Data = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve((e.target?.result as string) || "");
          reader.onerror = () => resolve("");
          reader.readAsDataURL(file);
        });

        if (base64Data) {
          const res = await fetch("/api/upload", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              fileName: name,
              fileType: file.type,
              fileData: base64Data
            })
          });

          if (res.ok) {
            const uploadData = await res.json();
            if (uploadData.fileUrl) {
              fileUrl = uploadData.fileUrl;
              fileId = uploadData.fileId;
              console.log("[PDF UPLOAD BASE64 SUCCESS] Server saved file at:", fileUrl);
            }
          }
        }
      } catch (jsonErr) {
        console.warn("[PDF UPLOAD WARN] Base64 server endpoint error:", jsonErr);
      }
    }

    // Client-side base64 fallback only if server is totally offline
    if (!fileUrl) {
      console.log("[PDF UPLOAD STEP 4: Local Fallback] Encoding local DataURL...");
      fileUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve((e.target?.result as string) || "");
        reader.onerror = () => resolve("");
        if (["txt", "md", "js", "ts", "jsx", "tsx", "py", "java", "cpp", "c", "html", "css", "json"].includes(ext)) {
          reader.readAsText(file);
        } else {
          reader.readAsDataURL(file);
        }
      });
    }

    if (!fileId) {
      fileId = "mat_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7);
    }

    const newMaterial: StudyMaterial = {
      id: fileId,
      name: name,
      size: sizeStr,
      addedTime: "Uploaded by Admin",
      type: type,
      isBookmarked: false,
      tag: targetUnitId ? "Unit File" : "Subject File",
      details: fileUrl
    };

    // Update State and sync curriculum
    if (targetUnitId) {
      const updatedUnits = subject.units.map(unit => {
        if (unit.id !== targetUnitId) return unit;
        return {
          ...unit,
          materials: [...(unit.materials || []), newMaterial]
        };
      });
      onUpdateSubject({
        ...subject,
        units: updatedUnits
      });
    } else {
      onUpdateSubject({
        ...subject,
        materials: [...(subject.materials || []), newMaterial]
      });
    }

    setLastUploadedMaterialName(name);
    setUploadSuccess(`✅ "${name}" successfully uploaded and attached!`);
    handleManualSaveToWeb(name);
  };

  const handleCreateWrittenNote = (targetUnitId: string | null) => {
    if (!adminNoteTitle.trim()) {
      alert("Please enter a title for the notes.");
      return;
    }
    if (!adminNoteContent.trim()) {
      alert("Please enter some note content.");
      return;
    }

    const name = adminNoteTitle.endsWith(".txt") || adminNoteTitle.endsWith(".md") ? adminNoteTitle : `${adminNoteTitle}.md`;

    const newMaterial: StudyMaterial = {
      id: "mat_" + Date.now() + "_" + Math.random().toString(36).substr(2, 5),
      name: name,
      size: `${(adminNoteContent.length / 1024).toFixed(1)} KB`,
      addedTime: "Created by Admin",
      type: adminNoteType,
      isBookmarked: false,
      tag: targetUnitId ? "Unit Notes" : "Subject Notes",
      details: adminNoteContent
    };

    if (targetUnitId) {
      const updatedUnits = subject.units.map(unit => {
        if (unit.id !== targetUnitId) return unit;
        return {
          ...unit,
          materials: [...(unit.materials || []), newMaterial]
        };
      });
      onUpdateSubject({
        ...subject,
        units: updatedUnits
      });
    } else {
      onUpdateSubject({
        ...subject,
        materials: [...(subject.materials || []), newMaterial]
      });
    }

    setAdminNoteTitle("");
    setAdminNoteContent("");
    setLastUploadedMaterialName(name);
    setUploadSuccess(`Note "${name}" created and saved permanently!`);
    handleManualSaveToWeb(name);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent, targetUnitId: string | null) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleProcessFile(e.dataTransfer.files[0], targetUnitId);
    }
  };

  // Generate customized quiz questions dynamically based on subject
  const subjectQuizQuestions = useMemo(() => {
    return [
      {
        question: `What is the core focus of ${subject.name} - ${subject.units[0]?.name || "Unit 1"}?`,
        options: [
          `Mastering the foundational principles, terminology, and standard operations defined in the syllabus.`,
          `Writing compilers in machine assembly language.`,
          `Configuring advanced external cloud computing servers.`,
          `Bypassing hardware memory controllers entirely.`
        ],
        answer: 0,
        explanation: `The initial unit focuses heavily on establishing strong, clean theoretical and practical foundations of ${subject.name}.`
      },
      {
        question: `In ${subject.name}, why is structured learning of ${subject.units[1]?.name || "Unit 2"} highly recommended?`,
        options: [
          `Because it builds sequential logical progression essential for resolving complex operations.`,
          `It is required to boot general laptops.`,
          `It decreases physical computer energy consumption by 90%.`,
          `It allows students to skip final exam projects.`
        ],
        answer: 0,
        explanation: `Unit 2 introduces core intermediate techniques which serve as a logical stepping stone to advanced applications.`
      }
    ];
  }, [subject]);

  const handleAnswerSubmit = (optionIndex: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(optionIndex);
    if (optionIndex === subjectQuizQuestions[currentQuestionIndex].answer) {
      setQuizScore(prev => prev + 1);
    }
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setShowExplanation(false);
    if (currentQuestionIndex < subjectQuizQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setIsPlayingQuiz(false);
      alert(`Well done! You scored ${quizScore}/${subjectQuizQuestions.length} in the "${subject.name}" knowledge sprint! 🥕`);
      setCurrentQuestionIndex(0);
      setQuizScore(0);
    }
  };

  const handleToggleUnitStatus = (unitId: string) => {
    const updatedUnits = subject.units.map(unit => {
      if (unit.id !== unitId) return unit;
      const nextStatus: "Locked" | "In Progress" | "Mastered" = 
        unit.status === "Mastered" ? "In Progress" : unit.status === "In Progress" ? "Locked" : "Mastered";
      const nextPercent = nextStatus === "Mastered" ? 100 : nextStatus === "In Progress" ? 50 : 0;
      return { ...unit, status: nextStatus, masteryPercent: nextPercent };
    });

    // Calculate completed units count
    const completed = updatedUnits.filter(u => u.status === "Mastered").length;

    onUpdateSubject({
      ...subject,
      units: updatedUnits,
      completedModules: completed,
      progressPercent: Math.round((completed / updatedUnits.length) * 100)
    });
  };

  return (
    <div className="flex-1 min-h-screen px-4 md:px-8 py-8 pb-32 text-[#231a0a] font-sans">
      
      {/* Page Back Action */}
      <button
        onClick={onBackToSubjects}
        className="mb-6 flex items-center gap-1.5 text-xs text-[#95491a] hover:text-[#40010d] font-bold transition-all cursor-pointer bg-[#f8e6cb]/30 hover:bg-[#f8e6cb]/60 px-3.5 py-2 rounded-xl border border-[#dac1c1]/20 shadow-xs"
      >
        <ArrowLeft size={14} /> Back to Subjects list
      </button>

      {/* Interactive Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[#544243] text-xs font-medium mb-8">
        <button onClick={onBackToSubjects} className="hover:text-[#95491a] font-semibold transition-colors">
          {courseName}
        </button>
        <ChevronRight size={12} className="text-[#877272]" />
        <span className="text-[#877272]">{semesterName}</span>
        <ChevronRight size={12} className="text-[#877272]" />
        <span className="text-[#231a0a] font-bold">{subject.name}</span>
      </nav>

      {/* Subject Header Banner */}
      <section className="mb-8 bg-gradient-to-br from-white to-[#feebd0] rounded-3xl p-6 md:p-8 border border-[#dac1c1]/30 shadow-xs relative overflow-hidden">
        <div className="absolute right-0 top-0 w-32 h-32 bg-[#fd9b65]/5 rounded-full blur-2xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="bg-[#40010d] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                {subject.difficulty}
              </span>
              {subject.isLab && (
                <span className="bg-[#accec2]/40 text-[#2e4c43] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Laboratory Course
                </span>
              )}
            </div>
            
            <h2 className="text-3xl font-extrabold text-[#40010d] tracking-tight">
              {subject.name}
            </h2>
            <p className="text-[#544243] text-sm max-w-xl leading-relaxed">
              {subject.description}
            </p>
          </div>

          {/* Subject Progress Card */}
          <div className="w-full md:w-64 bg-white p-4 rounded-2xl border border-[#dac1c1]/20 shadow-xs flex flex-col justify-between">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-extrabold text-[#877272] uppercase tracking-wider">Subject Mastery</span>
              <span className="text-sm font-extrabold text-[#95491a]">{subject.progressPercent}%</span>
            </div>
            <div className="w-full bg-[#f8e6cb] h-2 rounded-full overflow-hidden mb-3">
              <div 
                className="h-full bg-gradient-to-r from-[#fd9b65] to-[#95491a] rounded-full transition-all duration-500" 
                style={{ width: `${subject.progressPercent}%` }}
              ></div>
            </div>
            <span className="text-[10px] text-[#544243] font-medium block">
              {subject.completedModules} of {subject.units.length} Units Mastered
            </span>
          </div>
        </div>
      </section>

      {/* Tabs Selector */}
      <div className="flex border-b border-[#dac1c1]/30 gap-2 mb-6 overflow-x-auto whitespace-nowrap">
        {[
          { id: "syllabus", label: "Syllabus Units", count: subject.units.length },
          { id: "materials", label: "Study Files", count: subject.materials?.length || 0 },
          { id: "quiz", label: "Practice Sprint", icon: Award }
        ].map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-4 font-sans text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-2 ${
                isActive
                  ? "border-[#40010d] text-[#40010d]"
                  : "border-transparent text-[#544243] hover:text-[#231a0a]"
              }`}
            >
              {tab.icon && <tab.icon size={14} className={isActive ? "text-[#95491a]" : "text-[#877272]"} />}
              {tab.label}
              {tab.count !== undefined && (
                <span className={`px-1.5 py-0.5 rounded-full text-[9px] ${isActive ? "bg-[#40010d] text-white" : "bg-gray-100 text-[#544243]"}`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Dynamic Tab Body */}
      <div className="space-y-6">
        
        {/* SYLLABUS UNITS */}
        {activeTab === "syllabus" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {subject.units.map((unit) => {
              const isMastered = unit.status === "Mastered";
              const isInProgress = unit.status === "In Progress";
              const isLocked = unit.status === "Locked";

              return (
                <div
                  key={unit.id}
                  onClick={() => setSelectedUnit(selectedUnit?.id === unit.id ? null : unit)}
                  className={`bg-white rounded-3xl p-6 border transition-all cursor-pointer hover:shadow-md ${
                    selectedUnit?.id === unit.id ? "border-[#fd9b65] ring-1 ring-[#fd9b65]/20" : "border-[#dac1c1]/25"
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-[#877272] bg-slate-100 px-2.5 py-1 rounded-lg">
                        {unit.number}
                      </span>
                      <h4 className="font-bold text-sm text-[#40010d] group-hover:text-[#95491a]">
                        {unit.name}
                      </h4>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleUnitStatus(unit.id);
                      }}
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full border transition-all ${
                        isMastered ? "bg-[#c8eadd] border-[#6b8a80] text-[#012019]" :
                        isInProgress ? "bg-[#ffdbca] border-[#fd9b65] text-[#773203]" :
                        "bg-gray-50 border-gray-200 text-[#877272]"
                      }`}
                      title="Click to toggle study progress status"
                    >
                      {isMastered ? "Mastered" : isInProgress ? "Studying" : "Locked"}
                    </button>
                  </div>

                  <p className="text-[#544243] text-xs leading-relaxed mb-4">
                    {unit.description || "Comprehensive syllabus topics designed to align perfectly with course specifications."}
                  </p>

                  {/* Topics List accordion */}
                  {unit.topics && unit.topics.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                      <span className="text-[10px] font-extrabold text-[#95491a] tracking-wider uppercase block">Unit Syllabus Core Topics:</span>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {unit.topics.map((t, idx) => (
                          <span key={idx} className="bg-[#fff8f3] border border-[#dac1c1]/30 text-[#544243] text-[10px] px-2 py-1 rounded-lg">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Unit Content Sub-Tabs (Notes, Important Questions, YouTube References) */}
                  <div className="mt-4 pt-4 border-t border-gray-100 space-y-4" onClick={(e) => e.stopPropagation()}>
                    {/* Sub-Tab Navigation Pills */}
                    <div className="flex gap-1.5 p-1 bg-[#fff8f3] rounded-2xl border border-[#dac1c1]/30 overflow-x-auto">
                      <button
                        type="button"
                        onClick={() => setUnitActiveTab(prev => ({ ...prev, [unit.id]: "notes" }))}
                        className={`flex-1 min-w-[110px] py-1.5 px-3 rounded-xl text-[11px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                          (unitActiveTab[unit.id] || "notes") === "notes"
                            ? "bg-[#40010d] text-white shadow-xs"
                            : "text-[#544243] hover:bg-white/60"
                        }`}
                      >
                        <FileText size={13} />
                        <span>Notes & Files ({(unit.materials || []).length})</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setUnitActiveTab(prev => ({ ...prev, [unit.id]: "questions" }))}
                        className={`flex-1 min-w-[120px] py-1.5 px-3 rounded-xl text-[11px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                          unitActiveTab[unit.id] === "questions"
                            ? "bg-[#40010d] text-white shadow-xs"
                            : "text-[#544243] hover:bg-white/60"
                        }`}
                      >
                        <HelpCircle size={13} />
                        <span>Imp. Questions ({(unit.importantQuestions || []).length})</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setUnitActiveTab(prev => ({ ...prev, [unit.id]: "youtube" }))}
                        className={`flex-1 min-w-[110px] py-1.5 px-3 rounded-xl text-[11px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                          unitActiveTab[unit.id] === "youtube"
                            ? "bg-[#40010d] text-white shadow-xs"
                            : "text-[#544243] hover:bg-white/60"
                        }`}
                      >
                        <Youtube size={13} className="text-red-500 shrink-0" />
                        <span>YouTube Videos ({(unit.youtubeLinks || []).length})</span>
                      </button>
                    </div>

                    {/* SUB-TAB 1: NOTES & STUDY FILES */}
                    {(unitActiveTab[unit.id] || "notes") === "notes" && (
                      <div className="space-y-3 animate-fade-in">
                        {(!unit.materials || unit.materials.length === 0) ? (
                          <p className="text-[11px] text-[#877272] italic bg-[#fff8f3] p-3 rounded-xl border border-[#dac1c1]/20 text-left">
                            No study files attached to Unit {unit.number} yet. Use the upload dropzone below to attach PDFs, PPTs, Images, Word docs or Code!
                          </p>
                        ) : (
                          <div className="space-y-2">
                            {unit.materials.map((m) => {
                              const isCode = m.type === "code";
                              const isPdf = m.type === "pdf" || m.name.toLowerCase().endsWith(".pdf");
                              const isPpt = m.type === "ppt" || /\.(ppt|pptx)$/i.test(m.name);
                              const isImg = m.type === "image" || /\.(png|jpe?g|gif|webp|svg)$/i.test(m.name);
                              const isDoc = m.type === "doc" || /\.(doc|docx|txt|md)$/i.test(m.name);

                              return (
                                <div 
                                  key={m.id}
                                  className="p-3 bg-[#fff8f3]/90 hover:bg-[#ffebd6] rounded-xl border border-[#dac1c1]/30 flex flex-wrap justify-between items-center transition-all gap-2 group/file"
                                >
                                  <div className="flex items-center gap-3 min-w-0 flex-1">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                                      isPdf ? "bg-red-100 text-red-600" :
                                      isPpt ? "bg-orange-100 text-orange-600" :
                                      isImg ? "bg-purple-100 text-purple-600" :
                                      isDoc ? "bg-emerald-100 text-emerald-600" :
                                      isCode ? "bg-blue-100 text-blue-600" : "bg-amber-100 text-amber-700"
                                    }`}>
                                      {isPdf ? <FileText size={15} /> :
                                       isPpt ? <Presentation size={15} /> :
                                       isImg ? <ImageIcon size={15} /> :
                                       isDoc ? <FileText size={15} /> :
                                       isCode ? <Terminal size={15} /> : <BookOpen size={15} />}
                                    </div>
                                    <div className="text-left min-w-0">
                                      <h5 className="font-bold text-xs text-[#40010d] truncate group-hover/file:text-[#95491a]">
                                        {m.name}
                                      </h5>
                                      <p className="text-[10px] text-gray-500 mt-0.5">
                                        {m.size} • {m.type.toUpperCase()} file
                                      </p>
                                    </div>
                                  </div>

                                  {/* Side-by-Side View Document, Download & Save to Cloud Buttons */}
                                  <div className="flex items-center gap-1.5 shrink-0">
                                    <button 
                                      type="button"
                                      onClick={() => openMaterial(m)}
                                      className="px-2.5 py-1.5 bg-[#40010d] hover:bg-[#7a2c35] text-white rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 shadow-xs active:scale-95"
                                      title="View document inside app"
                                    >
                                      <Eye size={12} />
                                      <span>View Document</span>
                                    </button>

                                    <button 
                                      type="button"
                                      onClick={() => handleDownloadFile(m)}
                                      className="px-2.5 py-1.5 bg-[#f8e6cb] hover:bg-[#fd9b65] text-[#95491a] hover:text-white rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 shadow-xs active:scale-95"
                                      title="Download file directly to device"
                                    >
                                      <Download size={12} />
                                      <span>Download</span>
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => handleManualSaveToWeb(m.name)}
                                      disabled={isSavingWeb}
                                      className="px-2.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 shadow-xs active:scale-95 disabled:opacity-50"
                                      title="Ensure file is permanently saved to Web Cloud"
                                    >
                                      <Save size={12} />
                                      <span>Save</span>
                                    </button>

                                    {(isAdmin || selectedUnit?.id === unit.id) && (
                                      <button
                                        type="button"
                                        onClick={() => handleDeleteUnitMaterial(unit.id, m.id)}
                                        className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                                        title="Delete File"
                                      >
                                        <Trash2 size={13} />
                                      </button>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {/* File Upload Dropzone / Quick Add */}
                        {selectedUnit?.id === unit.id && (
                          <div className="mt-3 p-3.5 bg-[#fffcf9] rounded-2xl border border-dashed border-[#fd9b65] space-y-3 text-left">
                            <span className="text-[10px] font-extrabold text-[#40010d] uppercase block">
                              ➕ Attach File or Notes to Unit {unit.number}
                            </span>
                            
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => setAdminUploadMode("file")}
                                className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                                  adminUploadMode === "file" ? "bg-[#40010d] text-white" : "bg-slate-100 text-gray-500 hover:bg-slate-200"
                                }`}
                              >
                                Upload Any File (PDF, PPT, Image, Word, Code)
                              </button>
                              <button
                                type="button"
                                onClick={() => setAdminUploadMode("write")}
                                className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                                  adminUploadMode === "write" ? "bg-[#40010d] text-white" : "bg-slate-100 text-gray-500 hover:bg-slate-200"
                                }`}
                              >
                                Write Custom Notes
                              </button>
                            </div>

                            {uploadSuccess && (
                              <div className="p-2.5 bg-emerald-50 border border-emerald-300 rounded-xl space-y-2 text-left animate-fade-in shadow-xs">
                                <div className="flex items-center justify-between flex-wrap gap-2">
                                  <div className="flex items-center gap-2">
                                    <CheckCircle size={16} className="text-emerald-700 shrink-0" />
                                    <div>
                                      <p className="text-[11px] font-bold text-emerald-900">
                                        {uploadSuccess}
                                      </p>
                                      <p className="text-[9px] text-emerald-700">
                                        Attached to unit & synchronized with web cloud!
                                      </p>
                                    </div>
                                  </div>

                                  <button
                                    type="button"
                                    onClick={() => handleManualSaveToWeb(lastUploadedMaterialName || "Uploaded File")}
                                    disabled={isSavingWeb}
                                    className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white text-[10px] font-extrabold rounded-lg shadow-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 disabled:opacity-50"
                                  >
                                    <Save size={12} />
                                    <span>{isSavingWeb ? "Saving..." : webSaveSuccess ? "✅ Saved to Web!" : "💾 Save Upload to Web"}</span>
                                  </button>
                                </div>
                              </div>
                            )}
                            {uploadError && (
                              <p className="p-2 bg-red-50 text-red-800 text-[10px] font-bold rounded-lg animate-fade-in">
                                {uploadError}
                              </p>
                            )}

                            {adminUploadMode === "file" ? (
                              <div className="space-y-2">
                                <div
                                  onDragOver={onDragOver}
                                  onDragLeave={onDragLeave}
                                  onDrop={(e) => onDrop(e, unit.id)}
                                  className={`border border-dashed rounded-xl p-3.5 text-center cursor-pointer transition-all ${
                                    isDragging ? "border-[#95491a] bg-[#fff8f3]" : "border-[#dac1c1]/45 hover:border-[#fd9b65] bg-white"
                                  }`}
                                >
                                  <input
                                    type="file"
                                    id={`admin-unit-file-input-${unit.id}`}
                                    accept="*"
                                    className="hidden"
                                    onChange={(e) => {
                                      if (e.target.files && e.target.files[0]) {
                                        handleProcessFile(e.target.files[0], unit.id);
                                      }
                                      e.target.value = "";
                                    }}
                                  />
                                  <label htmlFor={`admin-unit-file-input-${unit.id}`} className="cursor-pointer space-y-1 block">
                                    <Upload size={18} className="text-[#95491a] mx-auto" />
                                    <div className="text-[10px] text-[#544243]">
                                      Upload PDFs, PPTs, PNG/JPG, Word, Code or ZIP • <span className="text-[#95491a] font-bold underline">Click to browse</span>
                                    </div>
                                  </label>
                                </div>

                                <div className="flex justify-end">
                                  <button
                                    type="button"
                                    onClick={() => handleManualSaveToWeb(lastUploadedMaterialName || "Uploaded File")}
                                    disabled={isSavingWeb}
                                    className="px-3 py-1.5 bg-[#40010d] hover:bg-[#7a2c35] text-white rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
                                  >
                                    <Save size={13} />
                                    <span>{isSavingWeb ? "Storing File on Web..." : webSaveSuccess ? "✅ Permanently Saved!" : "💾 Save Upload to Web Cloud"}</span>
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-2">
                                <div className="grid grid-cols-2 gap-2">
                                  <input
                                    type="text"
                                    placeholder="Notes Title (e.g. Unit 1 Quick Formula Sheet)"
                                    value={adminNoteTitle}
                                    onChange={(e) => setAdminNoteTitle(e.target.value)}
                                    className="w-full bg-white border border-[#dac1c1]/40 focus:border-[#fd9b65] rounded-lg px-2.5 py-1.5 text-[10px] focus:outline-none"
                                  />
                                  <select
                                    value={adminNoteType}
                                    onChange={(e) => setAdminNoteType(e.target.value as any)}
                                    className="w-full bg-white border border-[#dac1c1]/40 focus:border-[#fd9b65] rounded-lg px-2 py-1.5 text-[10px] focus:outline-none"
                                  >
                                    <option value="pdf">Document / PDF Notes</option>
                                    <option value="code">Code Snippet</option>
                                    <option value="question">Question Bank</option>
                                  </select>
                                </div>
                                <textarea
                                  rows={2}
                                  placeholder="Enter notes content or paste study code..."
                                  value={adminNoteContent}
                                  onChange={(e) => setAdminNoteContent(e.target.value)}
                                  className="w-full bg-white border border-[#dac1c1]/40 focus:border-[#fd9b65] rounded-lg p-2 text-[10px] focus:outline-none font-sans"
                                />
                                <div className="flex justify-end">
                                  <button
                                    type="button"
                                    onClick={() => handleCreateWrittenNote(unit.id)}
                                    className="px-3 py-1 bg-[#40010d] hover:bg-[#7a2c35] text-white rounded-lg text-[9px] font-bold cursor-pointer transition-colors"
                                  >
                                    Save Notes to Unit
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* SUB-TAB 2: IMPORTANT QUESTIONS */}
                    {unitActiveTab[unit.id] === "questions" && (
                      <div className="space-y-3 animate-fade-in text-left">
                        {(!unit.importantQuestions || unit.importantQuestions.length === 0) ? (
                          <div className="p-3.5 bg-[#fff8f3] rounded-2xl border border-[#dac1c1]/30 space-y-2">
                            <p className="text-[11px] font-bold text-[#40010d]">
                              🎯 Core High-Yield Exam Questions for Unit {unit.number}:
                            </p>
                            <div className="p-3 bg-white rounded-xl border border-amber-200/60 space-y-1">
                              <span className="text-[9px] font-extrabold px-2 py-0.5 bg-red-100 text-red-700 rounded-md inline-block">
                                Repeated University Exam Q
                              </span>
                              <h5 className="font-bold text-xs text-[#231a0a]">
                                Q1: Define the core operational lifecycle and fundamental architecture of {unit.name}.
                              </h5>
                              <p className="text-[11px] text-[#544243] leading-relaxed pt-1 border-t border-dashed border-gray-100">
                                <strong>Key Answer Points:</strong> Highlight theoretical definitions, operational workflows, structural diagrams, and practical examples for full marks in exams.
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-2.5">
                            {unit.importantQuestions.map((q, qIdx) => (
                              <div key={q.id} className="p-3.5 bg-[#fff8f3]/90 hover:bg-[#ffebd6] rounded-2xl border border-[#dac1c1]/30 transition-all space-y-2">
                                <div className="flex justify-between items-start gap-2">
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                      <span className="text-[9px] font-extrabold px-2 py-0.5 bg-[#40010d] text-white rounded-md">
                                        Q{qIdx + 1}
                                      </span>
                                      <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-md ${
                                        q.importance === "High" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-800"
                                      }`}>
                                        {q.importance || "High"} Importance
                                      </span>
                                      {q.yearTag && (
                                        <span className="text-[9px] text-[#95491a] bg-[#fff2e1] px-2 py-0.5 rounded-md font-bold">
                                          {q.yearTag}
                                        </span>
                                      )}
                                    </div>
                                    <h5 className="font-bold text-xs text-[#40010d] leading-snug">
                                      {q.question}
                                    </h5>
                                  </div>

                                  <button
                                    type="button"
                                    onClick={() => handleDeleteImportantQuestion(unit.id, q.id)}
                                    className="p-1 text-red-500 hover:text-red-700 rounded-lg shrink-0 cursor-pointer"
                                    title="Delete Question"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </div>

                                {q.answer && (
                                  <div>
                                    <button
                                      type="button"
                                      onClick={() => setOpenQuestionId(openQuestionId === q.id ? null : q.id)}
                                      className="text-[10px] font-bold text-[#95491a] hover:underline flex items-center gap-1 cursor-pointer"
                                    >
                                      <span>{openQuestionId === q.id ? "Hide Answer / Solution ▲" : "Show Answer / Solution ▼"}</span>
                                    </button>

                                    {openQuestionId === q.id && (
                                      <div className="mt-2 p-3 bg-white rounded-xl border border-amber-200 text-[11px] text-[#231a0a] leading-relaxed whitespace-pre-wrap font-sans">
                                        {q.answer}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Form to add Important Question */}
                        <div className="mt-3 p-3 bg-[#fffcf9] rounded-2xl border border-dashed border-[#fd9b65] space-y-2">
                          <span className="text-[10px] font-extrabold text-[#40010d] uppercase block">
                            ➕ Add Important Question for Unit {unit.number}
                          </span>
                          <input
                            type="text"
                            placeholder="Type exam question here..."
                            value={qText}
                            onChange={(e) => setQText(e.target.value)}
                            className="w-full bg-white border border-[#dac1c1]/40 focus:border-[#fd9b65] rounded-xl px-3 py-1.5 text-xs focus:outline-none"
                          />
                          <textarea
                            rows={2}
                            placeholder="Type solution or step-by-step answer key..."
                            value={qAnswer}
                            onChange={(e) => setQAnswer(e.target.value)}
                            className="w-full bg-white border border-[#dac1c1]/40 focus:border-[#fd9b65] rounded-xl p-2.5 text-xs focus:outline-none font-sans"
                          />
                          <div className="flex justify-between items-center pt-1">
                            <select
                              value={qImportance}
                              onChange={(e) => setQImportance(e.target.value as any)}
                              className="bg-white border border-[#dac1c1]/40 rounded-lg text-[10px] px-2 py-1 focus:outline-none font-bold text-[#544243]"
                            >
                              <option value="High">High Importance (Repeated)</option>
                              <option value="Medium">Medium Importance</option>
                              <option value="Low">Low / Optional</option>
                            </select>
                            <button
                              type="button"
                              onClick={() => handleAddImportantQuestion(unit.id)}
                              className="px-3.5 py-1.5 bg-[#40010d] hover:bg-[#7a2c35] text-white rounded-xl text-[10px] font-bold cursor-pointer transition-all shadow-xs"
                            >
                              Save Important Question
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* SUB-TAB 3: YOUTUBE VIDEO REFERENCES */}
                    {unitActiveTab[unit.id] === "youtube" && (
                      <div className="space-y-3 animate-fade-in text-left">
                        {(!unit.youtubeLinks || unit.youtubeLinks.length === 0) ? (
                          <div className="p-4 bg-[#fff8f3] rounded-2xl border border-[#dac1c1]/30 text-center space-y-2">
                            <Youtube size={28} className="text-red-500 mx-auto" />
                            <p className="text-xs font-bold text-[#40010d]">
                              No YouTube video references attached to Unit {unit.number} yet.
                            </p>
                            <p className="text-[10px] text-[#877272]">
                              Add YouTube video lecture links below so students can watch visual explanations!
                            </p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {unit.youtubeLinks.map((yt) => {
                              const ytId = getYouTubeVideoId(yt.url);
                              const thumbUrl = ytId 
                                ? `https://img.youtube.com/vi/${ytId}/mqdefault.jpg`
                                : "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&auto=format&fit=crop&q=60";

                              return (
                                <div key={yt.id} className="bg-white rounded-2xl border border-[#dac1c1]/30 overflow-hidden shadow-xs flex flex-col justify-between hover:shadow-md transition-all group">
                                  {/* Clickable Video Thumbnail -> Plays In-App */}
                                  <div 
                                    onClick={() => openYtVideo(yt, unit.number)}
                                    className="relative aspect-video bg-black overflow-hidden cursor-pointer group/thumb"
                                    title="Click to play video inside Read Rabbit"
                                  >
                                    <img 
                                      src={thumbUrl} 
                                      alt={yt.title}
                                      className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-300 opacity-90"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-center justify-center">
                                      <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg group-hover/thumb:scale-110 transition-transform">
                                        <Play size={22} className="fill-white ml-0.5" />
                                      </div>
                                    </div>
                                    <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[9px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                                      <Youtube size={11} className="text-red-500" />
                                      In-App Player
                                    </span>
                                  </div>

                                  <div className="p-3 space-y-2 flex-1 flex flex-col justify-between">
                                    <div>
                                      <h5 
                                        onClick={() => openYtVideo(yt, unit.number)}
                                        className="font-bold text-xs text-[#40010d] line-clamp-2 leading-snug hover:text-red-600 cursor-pointer transition-colors"
                                      >
                                        {yt.title}
                                      </h5>
                                      <span className="text-[10px] text-gray-500 block mt-1">
                                        {yt.channelName || "Curated Lecture Reference"}
                                      </span>
                                    </div>

                                    {/* Actions: Play In-App (Primary) | YouTube ↗ | Delete */}
                                    <div className="flex items-center justify-between pt-2 border-t border-gray-100 gap-1.5">
                                      <button
                                        type="button"
                                        onClick={() => openYtVideo(yt, unit.number)}
                                        className="flex-1 px-2.5 py-1.5 bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold rounded-xl transition-all flex items-center justify-center gap-1 shadow-xs cursor-pointer active:scale-95"
                                        title="Watch directly inside Read Rabbit"
                                      >
                                        <Play size={12} className="fill-white" />
                                        <span>Play In-App</span>
                                      </button>

                                      <a
                                        href={yt.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-2 py-1.5 bg-slate-100 hover:bg-slate-200 text-[#544243] text-[10px] font-bold rounded-xl transition-all flex items-center justify-center gap-1 shadow-xs cursor-pointer"
                                        title="Open external YouTube tab"
                                      >
                                        <ExternalLink size={11} />
                                        <span>YouTube ↗</span>
                                      </a>

                                      <button
                                        type="button"
                                        onClick={() => handleDeleteYoutubeLink(unit.id, yt.id)}
                                        className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
                                        title="Remove Video Reference"
                                      >
                                        <Trash2 size={13} />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {/* Form to add YouTube Video Reference */}
                        <div className="mt-3 p-3.5 bg-[#fffcf9] rounded-2xl border border-dashed border-red-300 space-y-2">
                          <span className="text-[10px] font-extrabold text-[#40010d] uppercase flex items-center gap-1">
                            <Youtube size={14} className="text-red-500" />
                            Attach YouTube Video Reference to Unit {unit.number}
                          </span>
                          <input
                            type="text"
                            placeholder="Video Title (e.g. Unit 1 Complete One-Shot Lecture)"
                            value={ytTitle}
                            onChange={(e) => setYtTitle(e.target.value)}
                            className="w-full bg-white border border-[#dac1c1]/40 focus:border-red-400 rounded-xl px-3 py-1.5 text-xs focus:outline-none"
                          />
                          <input
                            type="url"
                            placeholder="Paste YouTube Video URL (e.g. https://www.youtube.com/watch?v=...)"
                            value={ytUrl}
                            onChange={(e) => setYtUrl(e.target.value)}
                            className="w-full bg-white border border-[#dac1c1]/40 focus:border-red-400 rounded-xl px-3 py-1.5 text-xs focus:outline-none font-mono"
                          />
                          <div className="flex justify-end pt-1">
                            <button
                              type="button"
                              onClick={() => handleAddYoutubeLink(unit.id)}
                              className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-[10px] font-bold cursor-pointer transition-all shadow-xs flex items-center gap-1"
                            >
                              <Plus size={13} />
                              <span>Add YouTube Video</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Quick study material trigger inside card */}
                  <div className="flex items-center justify-between pt-4 mt-4 border-t border-dashed border-gray-100 text-[10px] font-bold">
                    <span className="text-[#877272] flex items-center gap-1">
                      <Clock size={12} /> {selectedUnit?.id === unit.id ? "Click card to collapse details" : "Click card to expand details"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* STUDY MATERIALS / FILES */}
        {activeTab === "materials" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-[#fff2e1]/30 p-4 rounded-2xl border border-[#dac1c1]/20">
              <span className="text-xs text-[#95491a] font-bold">
                💡 Need previous year papers or custom code examples? Switch to the AI Coach tab to generate them instantly!
              </span>
            </div>

            {isAdmin && (
              <div className="bg-white p-6 rounded-3xl border border-[#fd9b65] shadow-xs space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-[#dac1c1]/20">
                  <h4 className="font-bold text-sm text-[#40010d] flex items-center gap-2">
                    <ShieldCheck className="text-emerald-600" size={18} /> Admin Files & Notes Portal
                  </h4>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setAdminUploadMode("file")}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        adminUploadMode === "file" ? "bg-[#40010d] text-white" : "bg-slate-100 text-gray-600 hover:bg-slate-200"
                      }`}
                    >
                      Upload File
                    </button>
                    <button
                      onClick={() => setAdminUploadMode("write")}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        adminUploadMode === "write" ? "bg-[#40010d] text-white" : "bg-slate-100 text-gray-600 hover:bg-slate-200"
                      }`}
                    >
                      Write Notes
                    </button>
                  </div>
                </div>

                {uploadSuccess && (
                  <p className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl animate-fade-in">
                    {uploadSuccess}
                  </p>
                )}
                {uploadError && (
                  <p className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs font-bold rounded-xl animate-fade-in">
                    {uploadError}
                  </p>
                )}

                {adminUploadMode === "file" ? (
                  <div
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                    onDrop={(e) => onDrop(e, null)}
                    className={`border border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                      isDragging 
                        ? "border-[#95491a] bg-[#fff8f3]" 
                        : "border-[#dac1c1]/40 hover:border-[#fd9b65] bg-[#fffcf9]"
                    }`}
                  >
                    <input
                      type="file"
                      id="admin-subject-file-input"
                      accept="application/pdf,.pdf,image/*,.doc,.docx,.txt,.ppt,.pptx,.code,.js,.py,.zip"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleProcessFile(e.target.files[0], null);
                        }
                        e.target.value = "";
                      }}
                    />
                    <label htmlFor="admin-subject-file-input" className="cursor-pointer space-y-2 block">
                      <div className="w-12 h-12 rounded-full bg-[#f8e6cb]/60 text-[#95491a] flex items-center justify-center mx-auto shadow-sm">
                        <Upload size={22} />
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-[#40010d]">
                          Drag & Drop any study material file here
                        </p>
                        <p className="text-[10px] text-[#877272]">
                          or <span className="text-[#95491a] underline font-bold">click to browse</span> (Accepts PDF, MD, TXT, JS, PY, PNG etc.)
                        </p>
                      </div>
                    </label>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-extrabold text-[#877272] uppercase mb-1">Notes Title</label>
                        <input
                          type="text"
                          placeholder="e.g. Unit 1 Important Formulas"
                          value={adminNoteTitle}
                          onChange={(e) => setAdminNoteTitle(e.target.value)}
                          className="w-full bg-slate-50 border border-[#dac1c1]/40 focus:border-[#fd9b65] rounded-xl px-3 py-2 text-xs focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-extrabold text-[#877272] uppercase mb-1">Doc Type</label>
                        <select
                          value={adminNoteType}
                          onChange={(e) => setAdminNoteType(e.target.value as any)}
                          className="w-full bg-slate-50 border border-[#dac1c1]/40 focus:border-[#fd9b65] rounded-xl px-3 py-2 text-xs focus:outline-none"
                        >
                          <option value="pdf">Document / PDF</option>
                          <option value="code">Code Snippet</option>
                          <option value="question">Question Bank</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-extrabold text-[#877272] uppercase mb-1">Content / Body (Markdown supported)</label>
                      <textarea
                        rows={4}
                        placeholder="Write down notes, copy-paste code snippets, or enter reference details..."
                        value={adminNoteContent}
                        onChange={(e) => setAdminNoteContent(e.target.value)}
                        className="w-full bg-slate-50 border border-[#dac1c1]/40 focus:border-[#fd9b65] rounded-xl p-3 text-xs focus:outline-none font-sans"
                      />
                    </div>

                    <div className="flex justify-end">
                      <button
                        onClick={() => handleCreateWrittenNote(null)}
                        className="px-5 py-2.5 bg-[#40010d] hover:bg-[#7a2c35] text-white rounded-xl text-xs font-bold cursor-pointer transition-colors"
                      >
                        Publish & Save Note Permanently
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {(!subject.materials || subject.materials.length === 0) ? (
              <div className="py-12 bg-white rounded-3xl border border-[#dac1c1]/30 text-center max-w-lg mx-auto">
                <FileText size={36} className="text-[#dac1c1] mx-auto mb-3" />
                <h5 className="font-bold text-[#40010d]">No files uploaded yet</h5>
                <p className="text-xs text-[#544243] mt-1 max-w-xs mx-auto">
                  Administrators can attach PDF syllabus files, notes, question sheets, and code practicals directly to this subject here or via the Admin Portal.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {subject.materials.map(material => {
                  const isPdf = material.type === "pdf";
                  const isCode = material.type === "code";
                  
                  return (
                    <div
                      key={material.id}
                      onClick={() => openMaterial(material)}
                      className="p-5 bg-white rounded-3xl border border-[#dac1c1]/20 shadow-xs hover:shadow-md transition-all cursor-pointer flex justify-between items-center"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                          isPdf ? "bg-red-50 text-red-600" : isCode ? "bg-blue-50 text-blue-600" : "bg-yellow-50 text-yellow-700"
                        }`}>
                          {isPdf ? <FileText size={20} /> : isCode ? <Terminal size={20} /> : <HelpCircle size={20} />}
                        </div>
                        <div>
                          <h4 className="font-bold text-xs text-[#40010d] line-clamp-1">{material.name}</h4>
                          <span className="text-[10px] text-[#877272] font-semibold mt-1 block">
                            {material.size} • {material.addedTime}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <button 
                          onClick={() => openMaterial(material)}
                          className="px-3 py-1.5 bg-[#f8e6cb]/50 hover:bg-[#fd9b65] text-[#95491a] hover:text-[#341100] rounded-xl text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1"
                        >
                          <Eye size={12} />
                          {isPdf ? "View PDF" : isCode ? "View Code" : "View Notes"}
                        </button>
                        {isAdmin && (
                          <button
                            onClick={() => handleDeleteSubjectMaterial(material.id)}
                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
                            title="Delete File Permanently"
                          >
                            <Trash2 size={15} />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* PRACTICE SPRINT */}
        {activeTab === "quiz" && (
          <div className="max-w-xl mx-auto bg-white p-6 rounded-3xl border border-[#dac1c1]/20 shadow-xs text-center space-y-6">
            {!isPlayingQuiz ? (
              <div className="space-y-4 py-6">
                <div className="w-16 h-16 bg-[#fff2e1] text-[#95491a] rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <Award size={32} />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-[#40010d]">Syllabus Practice Sprint</h4>
                  <p className="text-xs text-[#544243] max-w-sm mx-auto mt-2 leading-relaxed">
                    Test your knowledge on "{subject.name}". Perfect to check your core unit mastery before midterm assessments!
                  </p>
                </div>
                <button
                  onClick={() => setIsPlayingQuiz(true)}
                  className="px-6 py-3 bg-[#40010d] hover:bg-[#7a2c35] text-white text-xs font-bold rounded-xl transition-all cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Play size={10} fill="white" /> Start Knowledge Sprint
                </button>
              </div>
            ) : (
              /* Quiz Questionnaire */
              <div className="text-left space-y-5">
                <div className="flex justify-between items-center pb-3 border-b border-[#dac1c1]/20">
                  <span className="text-[10px] font-extrabold text-[#95491a] uppercase tracking-wider">
                    Question {currentQuestionIndex + 1} of {subjectQuizQuestions.length}
                  </span>
                  <span className="text-xs bg-slate-100 px-2.5 py-0.5 rounded-lg font-bold text-[#544243]">
                    Score: {quizScore}
                  </span>
                </div>

                <h4 className="font-bold text-sm md:text-base text-[#40010d]">
                  {subjectQuizQuestions[currentQuestionIndex].question}
                </h4>

                <div className="space-y-2 pt-2">
                  {subjectQuizQuestions[currentQuestionIndex].options.map((option, idx) => {
                    const isSelected = selectedOption === idx;
                    const isCorrect = idx === subjectQuizQuestions[currentQuestionIndex].answer;
                    
                    let btnClass = "border-[#dac1c1]/50 bg-white hover:bg-[#fff8f3]";
                    if (selectedOption !== null) {
                      if (isCorrect) {
                        btnClass = "border-[#6b8a80] bg-emerald-50 text-[#012019]";
                      } else if (isSelected) {
                        btnClass = "border-red-300 bg-red-50 text-red-900";
                      } else {
                        btnClass = "border-gray-100 bg-gray-50 opacity-60";
                      }
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleAnswerSubmit(idx)}
                        disabled={selectedOption !== null}
                        className={`w-full p-4 rounded-2xl border text-left text-xs font-medium leading-relaxed transition-all cursor-pointer ${btnClass}`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>

                {showExplanation && (
                  <div className="p-4 bg-slate-50 rounded-2xl border border-gray-100 space-y-1.5">
                    <span className="text-[9px] font-bold text-[#6b8a80] uppercase tracking-wider block">Explanation:</span>
                    <p className="text-[11px] text-[#544243] leading-relaxed">
                      {subjectQuizQuestions[currentQuestionIndex].explanation}
                    </p>
                    <button
                      onClick={handleNextQuestion}
                      className="mt-3 px-4 py-2 bg-[#95491a] hover:bg-[#753101] text-white text-[10px] font-bold rounded-xl transition-colors cursor-pointer"
                    >
                      {currentQuestionIndex === subjectQuizQuestions.length - 1 ? "Finish Sprint" : "Next Question"}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

      </div>

      {/* In-App Study Material Document Viewer Modal */}
      <AnimatePresence>
        {activeMaterial && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 md:p-6">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white w-full max-w-4xl h-[85vh] max-h-[750px] rounded-3xl p-5 md:p-6 shadow-2xl relative border border-[#dac1c1]/30 flex flex-col justify-between overflow-hidden"
            >
              {/* Modal Top Header Bar */}
              <div className="flex flex-wrap justify-between items-center border-b border-[#dac1c1]/20 pb-4 gap-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    materialIconColor(activeMaterial.type)
                  }`}>
                    {activeMaterial.type === "code" ? <Terminal size={18} /> : <FileText size={18} />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-[#40010d] line-clamp-1">{activeMaterial.name}</h4>
                      <span className="bg-[#fff2e1] text-[#95491a] text-[9px] font-extrabold px-2 py-0.5 rounded-full border border-[#dac1c1]/30">
                        {activeMaterial.tag || "Study File"}
                      </span>
                    </div>
                    <span className="text-[10px] text-[#877272] block mt-0.5">
                      {activeMaterial.size} • {activeMaterial.addedTime || "In-App Permanent File"}
                    </span>
                  </div>
                </div>

                {/* Top Right Actions: Download & Close */}
                <div className="flex items-center gap-2 ml-auto">
                  {activeMaterial.details && !activeMaterial.details.startsWith("data:application/pdf") && !activeMaterial.details.startsWith("data:image/") && (
                    <button
                      onClick={() => handleCopyContent(activeMaterial.details)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-[#544243] text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                      title="Copy content to clipboard"
                    >
                      {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                      <span>{copied ? "Copied!" : "Copy"}</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleDownloadFile(activeMaterial)}
                    className="px-4 py-2 bg-[#40010d] hover:bg-[#7a2c35] text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-sm cursor-pointer active:scale-95"
                    title="Download file to device"
                  >
                    <Download size={14} />
                    <span>Download</span>
                  </button>

                  <button
                    onClick={closeMaterial}
                    className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-500 hover:text-[#40010d] cursor-pointer"
                    title="Close Viewer"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* In-App Document Viewer Canvas Body */}
              <div className="my-4 flex-1 w-full overflow-hidden rounded-2xl bg-slate-50 border border-[#dac1c1]/20 p-1 relative">
                {activeMaterial.details?.startsWith("data:application/pdf") || activeMaterial.name.toLowerCase().endsWith(".pdf") ? (
                  <div className="w-full h-full rounded-xl overflow-hidden bg-slate-900 flex flex-col">
                    {activeMaterial.details?.startsWith("data:") || activeMaterial.details?.startsWith("/api/files/") || activeMaterial.details?.startsWith("http") ? (
                      <object
                        data={activeMaterial.details}
                        type="application/pdf"
                        className="w-full h-full rounded-xl border-0"
                      >
                        <iframe
                          src={activeMaterial.details}
                          className="w-full h-full rounded-xl border-0"
                          title={activeMaterial.name}
                        />
                      </object>
                    ) : (
                      <div className="p-6 bg-[#fffcf9] rounded-2xl text-[#231a0a] text-sm leading-relaxed overflow-y-auto h-full whitespace-pre-wrap font-sans">
                        {activeMaterial.details}
                      </div>
                    )}
                  </div>
                ) : activeMaterial.details?.startsWith("data:image/") || /\.(png|jpe?g|gif|webp|svg)$/i.test(activeMaterial.name) ? (
                  <div className="w-full h-full bg-slate-950/5 rounded-xl p-4 flex items-center justify-center overflow-auto">
                    <img
                      src={activeMaterial.details}
                      alt={activeMaterial.name}
                      className="max-h-full max-w-full object-contain rounded-xl shadow-md"
                    />
                  </div>
                ) : activeMaterial.type === "code" || /\.(js|ts|jsx|tsx|py|java|cpp|c|html|css|json|sh)$/i.test(activeMaterial.name) ? (
                  <div className="w-full h-full bg-slate-950 text-[#c8eadd] font-mono text-xs rounded-xl p-5 overflow-auto leading-relaxed border border-slate-800">
                    <pre className="whitespace-pre-wrap break-all">
                      {activeMaterial.details || "// No code content available."}
                    </pre>
                  </div>
                ) : (
                  <div className="w-full h-full bg-[#fffcf9] rounded-xl p-6 border border-[#dac1c1]/30 text-[#231a0a] text-sm leading-relaxed overflow-y-auto font-sans whitespace-pre-wrap shadow-inner">
                    {activeMaterial.details || "This file contains verified syllabus notes compiled for your unit preparation."}
                  </div>
                )}
              </div>

              {/* Modal Bottom Status Footer */}
              <div className="border-t border-[#dac1c1]/20 pt-3 flex flex-wrap justify-between items-center text-[10px] text-[#877272]">
                <span className="flex items-center gap-1 font-medium">
                  <ShieldCheck size={14} className="text-emerald-600" />
                  Saved permanently on Read Rabbit Application • In-App Viewing Enabled
                </span>

                <div className="flex gap-2">
                  <button
                    onClick={closeMaterial}
                    className="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 text-[#544243] rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Close Viewer
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* IN-APP EMBEDDED YOUTUBE PLAYER MODAL WITH LIVE NOTEPAD */}
      <AnimatePresence>
        {activeYtVideo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-[#fffcf9] w-full max-w-5xl h-[92vh] rounded-3xl shadow-2xl border border-[#dac1c1]/40 flex flex-col p-4 sm:p-6 overflow-hidden relative"
            >
              {/* Modal Top Navigation & Title Bar */}
              <div className="flex flex-wrap justify-between items-center gap-3 border-b border-[#dac1c1]/20 pb-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-2xl bg-red-600 text-white flex items-center justify-center shadow-md shrink-0">
                    <Youtube size={22} className="fill-white" />
                  </div>
                  <div className="text-left min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-0.5 bg-red-100 text-red-700 text-[10px] font-extrabold rounded-md uppercase tracking-wider">
                        In-App Lecture Cinema 🍿
                      </span>
                      {activeYtVideo.unitNumber && (
                        <span className="px-2 py-0.5 bg-[#40010d] text-white text-[10px] font-bold rounded-md">
                          Unit {activeYtVideo.unitNumber}
                        </span>
                      )}
                    </div>
                    <h3 className="font-extrabold text-sm sm:text-base text-[#40010d] truncate max-w-lg mt-0.5">
                      {activeYtVideo.title}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={activeYtVideo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                    title="Open in native YouTube app or tab"
                  >
                    <ExternalLink size={13} />
                    <span className="hidden sm:inline">Open YouTube ↗</span>
                  </a>

                  <button
                    onClick={closeYtVideo}
                    className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-500 hover:text-[#40010d] cursor-pointer"
                    title="Close Video Player"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Main Content: Split Player & Live Note Taking Notepad */}
              <div className="my-4 flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-0 overflow-y-auto lg:overflow-hidden">
                {/* Embedded Video Canvas (2 Columns on Desktop) */}
                <div className="lg:col-span-2 flex flex-col h-full bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-lg">
                  <div className="relative w-full aspect-video bg-black flex-1 flex items-center justify-center">
                    {activeYtVideo.ytId ? (
                      <iframe
                        src={`https://www.youtube.com/embed/${activeYtVideo.ytId}?autoplay=1&rel=0&modestbranding=1`}
                        title={activeYtVideo.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        className="w-full h-full border-0"
                      />
                    ) : (
                      <div className="p-8 text-center space-y-3 text-white">
                        <Youtube size={48} className="text-red-500 mx-auto animate-pulse" />
                        <h4 className="font-bold text-base">Direct YouTube Video Link</h4>
                        <p className="text-xs text-gray-300 max-w-sm mx-auto">
                          This video link can be played directly on YouTube. Click below to launch in a new tab:
                        </p>
                        <a
                          href={activeYtVideo.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all shadow-md"
                        >
                          <ExternalLink size={14} />
                          <span>Watch on YouTube.com ↗</span>
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="p-3 bg-slate-900 border-t border-slate-800 flex justify-between items-center text-[11px] text-slate-300">
                    <span className="font-medium truncate max-w-md">
                      📺 Playing: <strong>{activeYtVideo.title}</strong>
                    </span>
                    <span className="text-slate-400 text-[10px] shrink-0">
                      Channel: {activeYtVideo.channelName || "Curated Lecture"}
                    </span>
                  </div>
                </div>

                {/* Side Panel: Concurrent Live Study Notepad */}
                <div className="flex flex-col h-full bg-[#fff8f3] rounded-2xl p-4 border border-[#dac1c1]/30 text-left space-y-3">
                  <div className="flex justify-between items-center border-b border-[#dac1c1]/30 pb-2">
                    <span className="text-xs font-extrabold text-[#40010d] uppercase flex items-center gap-1.5">
                      <FileText size={14} className="text-[#95491a]" />
                      Live Lecture Notepad 📝
                    </span>
                    <span className="text-[10px] text-[#95491a] font-bold">
                      Concurrent Notes
                    </span>
                  </div>

                  <p className="text-[10px] text-[#544243] leading-relaxed">
                    Jot down timestamps, core formulas, and key lecture points while watching without switching windows!
                  </p>

                  <textarea
                    rows={8}
                    placeholder={`e.g.\n02:15 - Definition of core concept\n08:40 - Key formula for exam\n14:10 - Solved problem step 1`}
                    value={ytPlayerNotes}
                    onChange={(e) => {
                      setYtPlayerNotes(e.target.value);
                      setYtNotesSaved(false);
                    }}
                    className="flex-1 w-full bg-white border border-[#dac1c1]/40 focus:border-[#fd9b65] rounded-xl p-3 text-xs text-[#231a0a] focus:outline-none font-sans leading-relaxed resize-none shadow-inner"
                  />

                  <div className="pt-2 flex justify-between items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (!ytPlayerNotes.trim()) return;
                        navigator.clipboard.writeText(`Lecture Notes (${activeYtVideo.title}):\n\n${ytPlayerNotes}`);
                        setYtNotesSaved(true);
                        setTimeout(() => setYtNotesSaved(false), 2500);
                      }}
                      className="flex-1 px-3 py-2 bg-[#40010d] hover:bg-[#7a2c35] text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
                    >
                      {ytNotesSaved ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                      <span>{ytNotesSaved ? "Notes Copied!" : "Copy Notes"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setYtPlayerNotes("")}
                      className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-[#544243] text-xs font-bold rounded-xl transition-all cursor-pointer"
                      title="Clear Notepad"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </div>

              {/* Modal Bottom Footer */}
              <div className="border-t border-[#dac1c1]/20 pt-3 flex justify-between items-center text-[10px] text-[#877272]">
                <span className="flex items-center gap-1 font-medium">
                  <ShieldCheck size={14} className="text-emerald-600" />
                  Read Rabbit In-App Video Engine • Seamless Distraction-Free Study Environment
                </span>

                <button
                  onClick={closeYtVideo}
                  className="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 text-[#544243] rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Close Cinema
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

// Helpers for styles
function materialIconColor(type: string) {
  if (type === "pdf") return "bg-red-50 text-red-600";
  if (type === "code") return "bg-blue-50 text-blue-600";
  return "bg-yellow-50 text-yellow-700";
}
