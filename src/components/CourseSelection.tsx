import { useState } from "react";
import { motion } from "motion/react";
import { Course } from "../types";
import { Brain, Database, BookOpen, ShieldCheck } from "lucide-react";
import { Logo } from "./Logo";

interface CourseSelectionProps {
  courses: Course[];
  onSelectCourse: (courseId: string) => void;
  onOpenAdminPortal: () => void;
  isAdmin: boolean;
  onSecretTrigger?: () => void;
}

export default function CourseSelection({
  courses,
  onSelectCourse,
  onOpenAdminPortal,
  isAdmin,
  onSecretTrigger,
}: CourseSelectionProps) {
  const [logoClicks, setLogoClicks] = useState(0);

  const handleLogoClick = () => {
    const nextClicks = logoClicks + 1;
    if (nextClicks >= 5) {
      setLogoClicks(0);
      if (onSecretTrigger) {
        onSecretTrigger();
      }
    } else {
      setLogoClicks(nextClicks);
      // Reset clicks after 3 seconds of inactivity
      setTimeout(() => setLogoClicks(0), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-[#fff8f3] flex flex-col items-center justify-center p-6 md:p-12 relative overflow-hidden">
      {/* Ambient background blur circles */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-[#fd9b65]/5 rounded-full filter blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-[#accec2]/10 rounded-full filter blur-3xl pointer-events-none"></div>

      <div className="max-w-4xl w-full text-center z-10 space-y-10">
        {/* Read Rabbit Logo Header */}
        <div className="flex flex-col items-center space-y-3">
          <div 
            onClick={handleLogoClick}
            className="hover:scale-105 transition-transform duration-300 cursor-pointer"
            title="Read Rabbit Logo"
          >
            <Logo size="lg" className="border-2 shadow-md" />
          </div>
          <div>
            <h1 className="font-sans text-2xl md:text-3xl font-extrabold text-[#40010d] tracking-tight">
              READ RABBIT
            </h1>
            <p className="font-sans text-[10px] tracking-[0.25em] uppercase text-[#95491a] font-semibold">
              A Burrow of Knowledge
            </p>
          </div>
        </div>

        {/* Course Intro */}
        <div className="space-y-3">
          <h2 className="font-sans text-3xl md:text-4xl font-extrabold text-[#40010d]">
            Select Your Specialization
          </h2>
          <p className="text-[#544243] text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            Welcome back to the burrow! Select your registered undergraduate program to load your customized subjects, syllabus units, and active study materials.
          </p>
        </div>

        {/* Course Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {courses.map((course, index) => {
            const isAIML = course.id === "aiml";
            const isDS = course.id === "ds";

            return (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                onClick={() => onSelectCourse(course.id)}
                className="group bg-white rounded-3xl p-6 border border-[#dac1c1]/20 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer text-left flex flex-col justify-between relative overflow-hidden"
              >
                {/* Visual Accent */}
                {isAIML && (
                  <span className="absolute top-4 right-4 bg-[#fd9b65] text-[#341100] text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    BCA Specialization
                  </span>
                )}

                <div>
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${
                    isAIML ? "bg-[#fff2e1] text-[#95491a]" : isDS ? "bg-cyan-50 text-cyan-800" : "bg-emerald-50 text-emerald-800"
                  }`}>
                    {isAIML ? <Brain size={24} /> : isDS ? <Database size={24} /> : <BookOpen size={24} />}
                  </div>

                  <h3 className="font-sans text-xl font-bold text-[#40010d] group-hover:text-[#95491a] transition-colors">
                    {course.name}
                  </h3>
                  <p className="text-[#544243] text-xs font-sans mt-3 leading-relaxed min-h-[50px]">
                    {course.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-[#dac1c1]/20 flex items-center justify-between text-[#95491a] font-sans text-xs font-bold">
                  <span>Explore Semesters</span>
                  <span className="group-hover:translate-x-1.5 transition-transform">→</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Footer info tag with small admin portal option */}
        <div className="pt-6 border-t border-[#dac1c1]/20 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-sans text-[#877272]">
          <div className="flex flex-col gap-1">
            <span>Read Rabbit Academic Portal © 2026. All study resources are peer-certified.</span>
            <span className="text-[#95491a] font-medium">Created with 🧡 by <strong className="text-[#40010d]">Umme Ruksar</strong> & <strong className="text-[#40010d]">Balaji C</strong></span>
          </div>
          <button
            onClick={onOpenAdminPortal}
            className="flex items-center gap-1.5 bg-[#40010d]/5 hover:bg-[#40010d]/10 text-[#40010d] px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer border border-[#40010d]/10"
          >
            <ShieldCheck size={13} /> Admin Portal
          </button>
        </div>
      </div>
    </div>
  );
}
