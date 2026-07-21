import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChatMessage } from "../types";
import { Send, Sparkles, X, CornerDownLeft, Coffee, BrainCircuit } from "lucide-react";

interface AITutorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTopic?: string;
}

const suggestionPrompts = [
  "Explain polymorphism in simple rabbit terms 🥕",
  "What is the difference between an abstract class and interface?",
  "Test my knowledge with a quick OOP question!",
];

export default function AITutorModal({ isOpen, onClose, currentTopic }: AITutorModalProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "model",
      text: "Hop in, little study companion! 🥕 I am Bunny Tutor, your academic Read Rabbit guide inside the Burrow of Knowledge. I'm ready to help you digest tricky concepts or quiz you for your computer science exams. What topic shall we burrow into today?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  // Handle sending user input
  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      role: "user",
      text: textToSend,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsThinking(true);

    try {
      const chatHistory = [...messages, userMsg].map((msg) => ({
        role: msg.role,
        text: msg.text,
      }));

      const res = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: chatHistory,
          currentTopic: currentTopic || "General Computer Science",
        }),
      });

      const data = await res.json();
      
      const modelMsg: ChatMessage = {
        id: Math.random().toString(),
        role: "model",
        text: data.text || "I apologize, little companion. My thoughts got lost in the clover fields. Could you please rephrase?",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, modelMsg]);
    } catch (err) {
      console.error(err);
      const errMsg: ChatMessage = {
        id: Math.random().toString(),
        role: "model",
        text: "My apologies! It seems a small draft has disconnected our tunnel. Let's try chatting again shortly! 🐾",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsThinking(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#40010d]/40 backdrop-blur-xs flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 15 }}
        className="bg-[#fff8f3] w-full max-w-2xl rounded-[32px] overflow-hidden shadow-2xl border border-[#dac1c1]/40 flex flex-col h-[600px]"
      >
        {/* Tutor Header */}
        <div className="bg-[#40010d] text-white p-5 flex items-center justify-between relative overflow-hidden shrink-0">
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#fd9b65_1px,transparent_1px)] bg-[size:12px_12px]"></div>
          
          <div className="flex items-center gap-4 relative z-10">
            <div className="relative">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-white border-2 border-[#fd9b65]">
                <img
                  alt="Bunny Tutor"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDYK1T4wS9kyeLcuUcIJ_4V1xd_VcduXRCLvaGR6s9brs8zHoQSIOy4ME44pV3VhTuglAUrblTyZaG740CpARWprDLsaR_ImgbTqDClYtZDc_wwfS3iVprxPyEcb_Nr9ONU2KHbWrNUS_SUZG6qdead_v8K_pUe7_z_DXiPD4yTThjGz4BiHtY8D9rb-igNrE2L8O2qIQi155yKz13BIwXPB97IHlOp3A5-zQSHYICHkwVYbbOTJqxatnHaUBtCGH0-NaSN-gO0RC6i"
                  className="w-full h-full object-cover scale-110"
                />
              </div>
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#accec2] border-2 border-[#40010d] rounded-full"></span>
            </div>

            <div>
              <h3 className="font-sans text-base font-extrabold flex items-center gap-1.5 leading-none">
                Bunny Tutor <Sparkles size={14} className="text-[#fd9b65]" />
              </h3>
              <p className="text-white/75 text-[11px] font-sans mt-1">
                Active in {currentTopic || "The Burrow of Knowledge"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full text-white/80 hover:text-white transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Messages Space */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-[#fffcf9]/60">
          {messages.map((msg) => {
            const isModel = msg.role === "model";
            return (
              <div key={msg.id} className={`flex ${isModel ? "justify-start" : "justify-end"} items-start gap-3`}>
                {isModel && (
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-white border border-[#dac1c1]/40 shrink-0">
                    <img
                      alt="Tutor"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDYK1T4wS9kyeLcuUcIJ_4V1xd_VcduXRCLvaGR6s9brs8zHoQSIOy4ME44pV3VhTuglAUrblTyZaG740CpARWprDLsaR_ImgbTqDClYtZDc_wwfS3iVprxPyEcb_Nr9ONU2KHbWrNUS_SUZG6qdead_v8K_pUe7_z_DXiPD4yTThjGz4BiHtY8D9rb-igNrE2L8O2qIQi155yKz13BIwXPB97IHlOp3A5-zQSHYICHkwVYbbOTJqxatnHaUBtCGH0-NaSN-gO0RC6i"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                <div
                  className={`p-4 rounded-2xl max-w-[80%] shadow-xs text-sm leading-relaxed ${
                    isModel
                      ? "bg-[#fff2e1] text-[#231a0a] border border-[#dac1c1]/20 rounded-tl-none font-sans"
                      : "bg-[#fd9b65] text-[#341100] font-bold rounded-tr-none font-sans"
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                </div>
              </div>
            );
          })}

          {isThinking && (
            <div className="flex justify-start items-center gap-3">
              <div className="w-8 h-8 rounded-full overflow-hidden bg-white border border-[#dac1c1]/40 shrink-0 flex items-center justify-center animate-pulse">
                <BrainCircuit size={16} className="text-[#95491a]" />
              </div>
              <div className="p-4 rounded-2xl bg-[#fff2e1] text-[#231a0a] border border-[#dac1c1]/20 rounded-tl-none flex items-center gap-1.5">
                <span className="w-2 h-2 bg-[#95491a] rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                <span className="w-2 h-2 bg-[#95491a] rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                <span className="w-2 h-2 bg-[#95491a] rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Prompts */}
        {messages.length === 1 && !isThinking && (
          <div className="px-5 py-2 flex flex-wrap gap-2 shrink-0 border-t border-[#dac1c1]/10 bg-white">
            {suggestionPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleSendMessage(prompt)}
                className="text-xs bg-[#f8e6cb]/60 hover:bg-[#f8e6cb] text-[#95491a] px-3 py-2 rounded-xl transition-colors text-left font-sans font-bold cursor-pointer border border-[#dac1c1]/10"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}

        {/* Send Input Area */}
        <div className="p-4 border-t border-[#dac1c1]/30 bg-white flex items-center gap-2 shrink-0">
          <input
            type="text"
            placeholder="Ask Bunny Tutor anything..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSendMessage(inputValue);
            }}
            className="flex-1 bg-[#fff8f3]/60 px-4 py-3 rounded-2xl border border-[#dac1c1]/40 text-sm font-sans focus:outline-none focus:border-[#fd9b65] transition-colors"
          />

          <button
            onClick={() => handleSendMessage(inputValue)}
            className="p-3 bg-[#40010d] text-white rounded-2xl hover:bg-[#7a2c35] transition-all cursor-pointer shadow-sm active:scale-95 flex items-center justify-center shrink-0"
          >
            <Send size={16} />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
