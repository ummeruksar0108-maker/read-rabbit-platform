import { motion } from "motion/react";
import { Subject } from "../types";
import * as LucideIcons from "lucide-react";
import { ChevronRight, Plus, CheckCircle, Trash2, ArrowLeft } from "lucide-react";

interface CuratedSubjectsProps {
  subjects: Subject[];
  onSelectSubject: (subjectId: string) => void;
  onAddSubjectClick: () => void;
  onDeleteSubject: (subjectId: string) => void;
  overallProgress: number;
  isAdmin: boolean;
  onBack?: () => void;
  semesterName?: string;
}

export default function CuratedSubjects({
  subjects,
  onSelectSubject,
  onAddSubjectClick,
  onDeleteSubject,
  overallProgress,
  isAdmin,
  onBack,
  semesterName = "Semester",
}: CuratedSubjectsProps) {
  return (
    <div className="flex-1 min-h-screen px-4 md:px-8 py-8 pb-32 text-[#231a0a]">
      {/* Page Back Action */}
      {onBack && (
        <button
          onClick={onBack}
          className="mb-6 flex items-center gap-1.5 text-xs text-[#95491a] hover:text-[#40010d] font-bold transition-all cursor-pointer bg-[#f8e6cb]/30 hover:bg-[#f8e6cb]/60 px-3.5 py-2 rounded-xl border border-[#dac1c1]/20 shadow-xs"
        >
          <ArrowLeft size={14} /> Back to Semester Roadmap
        </button>
      )}

      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[#544243] text-sm font-sans font-medium mb-8">
        <span onClick={onBack} className="hover:text-[#95491a] cursor-pointer">Home</span>
        <ChevronRight size={14} className="text-[#877272]" />
        <span onClick={onBack} className="hover:text-[#95491a] cursor-pointer">{semesterName}</span>
        <ChevronRight size={14} className="text-[#877272]" />
        <span className="text-[#231a0a] font-bold">Subjects</span>
      </nav>

      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h2 className="font-sans text-3xl md:text-4xl font-extrabold text-[#40010d] mb-2">Curated Subjects</h2>
          <p className="text-[#544243] text-sm md:text-base max-w-lg mt-1 font-sans">
            Select a subject to dive back into your focused study burrow. Your progress is saved automatically.
          </p>
        </div>

        {/* Overall Semester Progress */}
        <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl shadow-xs border border-[#dac1c1]/20">
          <span className="font-sans text-xs font-bold text-[#544243] tracking-wider uppercase">
            Overall Semester Progress
          </span>
          <div className="w-32 h-2.5 bg-[#f8e6cb] rounded-full overflow-hidden shadow-inner">
            <div className="h-full bg-gradient-to-r from-[#fd9b65] to-[#95491a] rounded-full" style={{ width: `${overallProgress}%` }}></div>
          </div>
          <span className="font-sans text-sm font-extrabold text-[#95491a]">{overallProgress}%</span>
        </div>
      </div>

      {/* Subject Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map((subject, index) => {
          const IconComponent = (LucideIcons as any)[subject.icon] || LucideIcons.BookOpen;
          const isDone = subject.completedModules === subject.modulesCount;

          return (
            <motion.div
              key={subject.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
              onClick={() => onSelectSubject(subject.id)}
              className="group relative bg-white rounded-3xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300 border border-transparent hover:border-[#fd9b65]/30 cursor-pointer overflow-hidden flex flex-col justify-between min-h-[260px]"
            >
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className={`w-12 h-12 rounded-2xl ${subject.bgColor} flex items-center justify-center`}>
                    <IconComponent size={24} />
                  </div>
                  
                  {isAdmin ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteSubject(subject.id);
                      }}
                      className="p-2 text-red-400 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors"
                      title="Remove Subject"
                    >
                      <Trash2 size={16} />
                    </button>
                  ) : (
                    <ChevronRight size={18} className="text-[#877272] opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  )}
                </div>

                <h3 className="font-sans text-xl font-bold text-[#40010d] mb-1 group-hover:text-[#95491a] transition-colors">
                  {subject.name}
                </h3>
                <p className="text-[#544243] text-xs font-sans mb-6 leading-relaxed line-clamp-2">
                  {subject.description}
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 bg-[#c8eadd] text-[#012019] rounded-full text-[11px] font-bold font-sans">
                    {subject.modulesCount} Modules
                  </span>
                  <span className="px-3 py-1 bg-[#f3e0c5] text-[#544243] rounded-full text-[11px] font-bold font-sans">
                    {subject.difficulty}
                  </span>
                </div>

                <div className="pt-4 border-t border-[#dac1c1]/30 flex items-center justify-between">
                  <span className="text-xs font-sans text-[#877272] font-semibold">
                    {subject.completedModules}/{subject.modulesCount} Completed
                  </span>
                  {isDone ? (
                    <span className="text-[#6b8a80] flex items-center gap-1 text-xs font-bold font-sans">
                      <CheckCircle size={14} className="fill-[#c8eadd]" /> Completed
                    </span>
                  ) : (
                    <div className="flex -space-x-1.5">
                      <div className="w-5 h-5 rounded-full border border-white bg-slate-200"></div>
                      <div className="w-5 h-5 rounded-full border border-white bg-slate-300"></div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* Empty "Add" Card - only visible to Admins */}
        {isAdmin && (
          <motion.div
            onClick={onAddSubjectClick}
            className="flex flex-col items-center justify-center bg-[#fff8f3]/20 border-2 border-dashed border-[#dac1c1]/80 rounded-3xl p-6 group hover:border-[#fd9b65] hover:bg-[#fff2e1]/30 transition-all duration-300 cursor-pointer min-h-[260px]"
          >
            <div className="w-12 h-12 rounded-full bg-[#f8e6cb] flex items-center justify-center mb-4 group-hover:bg-[#fd9b65] group-hover:text-[#341100] transition-colors">
              <Plus size={20} className="text-[#544243] group-hover:text-[#341100]" />
            </div>
            <span className="font-sans text-sm font-bold text-[#544243] group-hover:text-[#40010d] transition-colors">
              Add Subject
            </span>
            <span className="font-sans text-xs text-[#877272] mt-1">Expand your curriculum roadmap</span>
          </motion.div>
        )}
      </div>
    </div>
  );
}
