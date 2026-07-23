import { useState } from "react";
import { Layers, BookOpen, Settings, HelpCircle, LogOut, ShieldCheck, RefreshCw, Sparkles } from "lucide-react";
import { Logo } from "./Logo";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedCourseName: string | null;
  onChangeCourse: () => void;
  isAdmin: boolean;
  onSecretTrigger?: () => void;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  selectedCourseName,
  onChangeCourse,
  isAdmin,
  onSecretTrigger,
}: SidebarProps) {
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
      // Automatically reset click count after 3 seconds of inactivity
      setTimeout(() => setLogoClicks(0), 3000);
    }
  };

  const navItems = [
    { id: "semesters", label: "My Semesters", icon: Layers },
    { id: "library", label: "The Library", icon: BookOpen },
    ...(isAdmin ? [{ id: "admin", label: "Admin Portal", icon: ShieldCheck, badge: "Active" }] : []),
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside className="hidden md:flex flex-col h-screen py-6 border-r border-[#dac1c1]/50 bg-[#fff2e1]/70 w-64 fixed left-0 top-0 text-[#231a0a] justify-between">
      <div>
        {/* Logo and Course Info */}
        <div className="px-6 mb-8 flex flex-col items-center text-center space-y-3">
          <div 
            onClick={handleLogoClick}
            className="hover:scale-105 transition-transform duration-250 cursor-pointer"
            title="Read Rabbit Logo"
          >
            <Logo size="md" />
          </div>
          <div>
            <h2 className="font-sans text-lg font-extrabold tracking-tight text-[#40010d]">
              READ RABBIT
            </h2>
            {selectedCourseName ? (
              <span className="text-[10px] bg-[#fd9b65] text-[#341100] px-2.5 py-0.5 rounded-full font-bold inline-block mt-1">
                {selectedCourseName}
              </span>
            ) : (
              <span className="text-[10px] text-[#544243] font-sans font-medium opacity-80">
                A Burrow of Knowledge
              </span>
            )}
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between gap-3 rounded-xl px-4 py-3 transition-all duration-250 cursor-pointer ${
                  isActive
                    ? "bg-[#fd9b65] text-[#341100] font-bold shadow-xs transform translate-x-1"
                    : "text-[#544243] hover:bg-[#f8e6cb] hover:text-[#231a0a]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} className={isActive ? "text-[#341100]" : "text-[#877272]"} />
                  <span className="text-sm font-sans font-semibold">{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className="bg-[#6b8a80] text-white text-[9px] px-2 py-0.5 rounded-full font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* Quick Course Switcher Button */}
          {selectedCourseName && (
            <button
              onClick={onChangeCourse}
              className="w-[calc(100%-8px)] mx-1 flex items-center gap-3 rounded-xl px-4 py-3 text-[#95491a] hover:bg-[#f8e6cb] transition-all cursor-pointer border border-dashed border-[#fd9b65]/20 mt-4 text-left"
            >
              <RefreshCw size={18} className="text-[#95491a]" />
              <span className="text-sm font-sans font-bold">Switch Course</span>
            </button>
          )}
        </nav>
      </div>

      <div className="px-2 space-y-1">
        <button
          onClick={() => setActiveTab("help")}
          className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 transition-all ${
            activeTab === "help"
              ? "bg-[#fd9b65]/20 text-[#231a0a] font-semibold"
              : "text-[#544243] hover:bg-[#f8e6cb]"
          }`}
        >
          <HelpCircle size={18} className="text-[#877272]" />
          <span className="text-sm font-sans">Help</span>
        </button>

        <button
          onClick={() => setActiveTab("logout")}
          className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-red-700 hover:bg-red-50 transition-all cursor-pointer"
        >
          <LogOut size={18} className="text-red-500" />
          <span className="text-sm font-sans">Logout</span>
        </button>
      </div>
    </aside>
  );
}
