import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Subject, Unit, StudyMaterial } from "../types";
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
  Upload
} from "lucide-react";

interface SubjectHubProps {
  courseName: string;
  semesterName: string;
  subject: Subject;
  isAdmin: boolean;
  onBackToSubjects: () => void;
  onUpdateSubject: (updatedSubject: Subject) => void;
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

  // Practice Quiz / Flashcard State
  const [isPlayingQuiz, setIsPlayingQuiz] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);

  // Admin File & Notes Upload / Management State
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");
  const [adminNoteTitle, setAdminNoteTitle] = useState("");
  const [adminNoteContent, setAdminNoteContent] = useState("");
  const [adminNoteType, setAdminNoteType] = useState<"pdf" | "code" | "question">("pdf");
  const [adminUploadMode, setAdminUploadMode] = useState<"file" | "write">("file");

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

  const handleProcessFile = (file: File, targetUnitId: string | null) => {
    setUploadError("");
    setUploadSuccess("");
    if (!file) return;

    let sizeStr = "";
    if (file.size >= 1024 * 1024) {
      sizeStr = (file.size / (1024 * 1024)).toFixed(1) + " MB";
    } else {
      sizeStr = (file.size / 1024).toFixed(0) + " KB";
    }

    const name = file.name;
    const ext = name.split(".").pop()?.toLowerCase() || "";
    let type: "pdf" | "code" | "question" = "pdf";
    if (["js", "ts", "jsx", "tsx", "py", "java", "cpp", "c", "html", "css", "json", "sh", "txt"].includes(ext)) {
      type = "code";
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      const detailsText = result || "Study file uploaded by Administrator.";
      
      const newMaterial: StudyMaterial = {
        id: "mat_" + Date.now() + "_" + Math.random().toString(36).substr(2, 5),
        name: name,
        size: sizeStr,
        addedTime: "Uploaded by Admin",
        type: type,
        isBookmarked: false,
        tag: targetUnitId ? "Unit File" : "Subject File",
        details: detailsText
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

      setUploadSuccess(`"${name}" successfully attached and saved!`);
      setTimeout(() => setUploadSuccess(""), 4000);
    };

    reader.onerror = () => {
      setUploadError("Could not read file. Please try another file.");
    };

    if (["txt", "md", "js", "ts", "jsx", "tsx", "py", "java", "cpp", "c", "html", "css", "json"].includes(ext)) {
      reader.readAsText(file);
    } else {
      reader.readAsDataURL(file);
    }
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
    setUploadSuccess(`Note "${name}" created and saved permanently!`);
    setTimeout(() => setUploadSuccess(""), 4000);
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

                  {/* Expanded unit materials list */}
                  {selectedUnit?.id === unit.id && (
                    <div className="mt-4 pt-4 border-t border-gray-100 space-y-3" onClick={(e) => e.stopPropagation()}>
                      <span className="text-[10px] font-extrabold text-[#95491a] tracking-wider uppercase block">
                        📂 Unit Study Materials & PDFs ({(unit.materials || []).length}):
                      </span>
                      {(!unit.materials || unit.materials.length === 0) ? (
                        <p className="text-[11px] text-[#877272] italic bg-[#fff8f3] p-3 rounded-xl border border-[#dac1c1]/20">
                          No customized files attached to this unit yet.
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {unit.materials.map((m) => {
                            const isCode = m.type === "code";
                            return (
                              <div 
                                key={m.id}
                                className="p-3 bg-[#fff8f3]/60 hover:bg-[#fff2e1]/40 rounded-xl border border-[#dac1c1]/25 flex justify-between items-center transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                    m.type === "pdf" ? "bg-red-50 text-red-600" : isCode ? "bg-blue-50 text-blue-600" : "bg-yellow-50 text-yellow-700"
                                  }`}>
                                    {isCode ? <Terminal size={14} /> : <FileText size={14} />}
                                  </div>
                                  <div className="text-left">
                                    <h5 className="font-bold text-xs text-[#40010d] line-clamp-1">{m.name}</h5>
                                    <p className="text-[10px] text-gray-400 mt-0.5">{m.size} • Study Reference</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                  <button 
                                    onClick={() => setActiveMaterial(m)}
                                    className="px-3 py-1.5 bg-[#f8e6cb]/60 hover:bg-[#fd9b65] text-[#95491a] hover:text-[#341100] rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                                  >
                                    {isCode ? "View Code" : "View Notes"}
                                  </button>
                                  {isAdmin && (
                                    <button
                                      onClick={() => handleDeleteUnitMaterial(unit.id, m.id)}
                                      className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                                      title="Delete File Permanently"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {isAdmin && (
                        <div className="mt-4 p-4 bg-[#fffcf9] rounded-2xl border border-dashed border-[#fd9b65] space-y-3 text-left">
                          <span className="text-[10px] font-extrabold text-[#40010d] uppercase block">
                            ➕ Quick Attach File or Notes to Unit {unit.number}
                          </span>
                          
                          <div className="flex gap-2">
                            <button
                              onClick={() => setAdminUploadMode("file")}
                              className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                                adminUploadMode === "file" ? "bg-[#40010d] text-white" : "bg-slate-100 text-gray-500 hover:bg-slate-200"
                              }`}
                            >
                              Upload File
                            </button>
                            <button
                              onClick={() => setAdminUploadMode("write")}
                              className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                                adminUploadMode === "write" ? "bg-[#40010d] text-white" : "bg-slate-100 text-gray-500 hover:bg-slate-200"
                              }`}
                            >
                              Write Notes
                            </button>
                          </div>

                          {uploadSuccess && (
                            <p className="p-2 bg-emerald-50 text-emerald-800 text-[10px] font-bold rounded-lg animate-fade-in">
                              {uploadSuccess}
                            </p>
                          )}
                          {uploadError && (
                            <p className="p-2 bg-red-50 text-red-800 text-[10px] font-bold rounded-lg animate-fade-in">
                              {uploadError}
                            </p>
                          )}

                          {adminUploadMode === "file" ? (
                            <div
                              onDragOver={onDragOver}
                              onDragLeave={onDragLeave}
                              onDrop={(e) => onDrop(e, unit.id)}
                              className={`border border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
                                isDragging ? "border-[#95491a] bg-[#fff8f3]" : "border-[#dac1c1]/45 hover:border-[#fd9b65] bg-white"
                              }`}
                            >
                              <input
                                type="file"
                                id={`admin-unit-file-input-${unit.id}`}
                                className="hidden"
                                onChange={(e) => {
                                  if (e.target.files && e.target.files[0]) {
                                    handleProcessFile(e.target.files[0], unit.id);
                                  }
                                }}
                              />
                              <label htmlFor={`admin-unit-file-input-${unit.id}`} className="cursor-pointer space-y-1 block">
                                <Upload size={18} className="text-[#95491a] mx-auto" />
                                <div className="text-[10px] text-[#544243]">
                                  Drag & Drop or <span className="text-[#95491a] font-bold underline">click to browse</span>
                                </div>
                              </label>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <div className="grid grid-cols-2 gap-2">
                                <input
                                  type="text"
                                  placeholder="Notes Title (e.g. Unit Notes)"
                                  value={adminNoteTitle}
                                  onChange={(e) => setAdminNoteTitle(e.target.value)}
                                  className="w-full bg-white border border-[#dac1c1]/40 focus:border-[#fd9b65] rounded-lg px-2.5 py-1.5 text-[10px] focus:outline-none"
                                />
                                <select
                                  value={adminNoteType}
                                  onChange={(e) => setAdminNoteType(e.target.value as any)}
                                  className="w-full bg-white border border-[#dac1c1]/40 focus:border-[#fd9b65] rounded-lg px-2 py-1.5 text-[10px] focus:outline-none"
                                >
                                  <option value="pdf">Document / PDF</option>
                                  <option value="code">Code Snippet</option>
                                  <option value="question">Question Bank</option>
                                </select>
                              </div>
                              <textarea
                                rows={2}
                                placeholder="Enter notes content or paste code..."
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
                                  Save to Unit
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

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
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleProcessFile(e.target.files[0], null);
                        }
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
                      onClick={() => setActiveMaterial(material)}
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
                          onClick={() => setActiveMaterial(material)}
                          className="px-3 py-1.5 bg-[#f8e6cb]/50 hover:bg-[#fd9b65] text-[#95491a] hover:text-[#341100] rounded-xl text-[10px] font-bold transition-all cursor-pointer"
                        >
                          {isCode ? "View Code" : "Open File"}
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

      {/* Study Material Details Dialog Modal */}
      <AnimatePresence>
        {activeMaterial && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl relative border border-[#dac1c1]/30 flex flex-col justify-between"
            >
              <div className="flex justify-between items-start border-b border-[#dac1c1]/20 pb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    materialIconColor(activeMaterial.type)
                  }`}>
                    <FileText size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#40010d] line-clamp-1">{activeMaterial.name}</h4>
                    <span className="text-[10px] text-[#877272] block">{activeMaterial.size} • Verified Study File</span>
                  </div>
                </div>
                <button
                  onClick={() => setActiveMaterial(null)}
                  className="p-1.5 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-[#40010d]"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="my-6 space-y-4 max-h-[300px] overflow-y-auto pr-1">
                {activeMaterial.type === "code" ? (
                  <div className="space-y-2">
                    <span className="text-[10px] font-extrabold text-[#95491a] tracking-wider uppercase block">Code Preview:</span>
                    <pre className="p-4 bg-slate-950 text-[#c8eadd] font-mono text-xs rounded-xl overflow-x-auto leading-relaxed max-h-[220px]">
                      {activeMaterial.details || `// No direct code preview available`}
                    </pre>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <span className="text-[10px] font-extrabold text-[#95491a] tracking-wider uppercase block">File Synopsis & Insights:</span>
                    <p className="text-xs text-[#544243] leading-relaxed">
                      {activeMaterial.details || "This file contains detailed curated chapters compiled by seniors and approved by teaching assistants for end-semester revisions."}
                    </p>
                  </div>
                )}
              </div>

              <div className="border-t border-[#dac1c1]/20 pt-4 flex justify-end gap-3">
                <button
                  onClick={() => setActiveMaterial(null)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-xs font-bold"
                >
                  Close Archive
                </button>
                <button
                  onClick={() => {
                    alert(`The file "${activeMaterial.name}" is now saved to your offline cache! 🥕`);
                    setActiveMaterial(null);
                  }}
                  className="px-5 py-2 bg-[#40010d] hover:bg-[#7a2c35] text-white rounded-xl text-xs font-bold"
                >
                  Download File
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
