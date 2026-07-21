export interface Unit {
  id: string;
  number: string;
  name: string;
  description: string;
  masteryPercent: number;
  status: "Mastered" | "In Progress" | "Locked";
  topics?: string[];
  materials?: StudyMaterial[];
}

export interface StudyMaterial {
  id: string;
  name: string;
  size: string;
  addedTime: string;
  type: "pdf" | "code" | "question";
  isBookmarked: boolean;
  tag?: string;
  details?: string;
}

export interface Subject {
  id: string;
  name: string;
  description: string;
  modulesCount: number;
  completedModules: number;
  difficulty: "Core" | "Intermediate" | "Advanced";
  icon: string; // lucide icon name
  bgColor: string; // e.g. "bg-secondary-fixed", "bg-tertiary-fixed", etc.
  textColor: string;
  progressPercent: number;
  units: Unit[];
  materials: StudyMaterial[];
  isLab?: boolean;
}

export interface Semester {
  id: number;
  name: string;
  description: string;
  status: "Mastered" | "In Progress" | "Locked";
  modulesCount: number;
  completedModules: number;
  progressPercent: number;
  borderClass: string;
  badgeBg: string;
  badgeText: string;
  icon: string;
  subjects: Subject[];
}

export interface Course {
  id: string; // "general", "aiml", "ds"
  name: string; // "BCA GENERAL", "BCA AI/ML", "BCA DS"
  description: string;
  semesters: Semester[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "model";
  text: string;
  timestamp: Date;
}

