"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, User, Stars } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatProps {
  context?: string;
}

export default function AstrologerChat({ context }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Namaste. I have analyzed your chart. Ask me anything about your career, relationships, destiny, and how to make your life better",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMsg: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, newMsg]);
    setInput("");
    setLoading(true);

    try {
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: newMsg.content,
          context: context || "No context available.",
        }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.response },
      ]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "The cosmic connection is faint right now. Please try again in a moment.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto h-[550px] flex flex-col rounded-3xl border border-white/10 bg-[#0a0514]/50 backdrop-blur-3xl shadow-2xl overflow-hidden relative group">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-600/10 rounded-full blur-[80px] pointer-events-none" />

      {/* Header */}
      <div className="p-4 border-b border-white/5 bg-white/5 flex items-center justify-between backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            <Stars className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-white tracking-wide">
              PanditAI
            </h3>
            <div className="flex items-center gap-1.5 opacity-60">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[10px] uppercase tracking-widest text-white">
                Online
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent z-10"
      >
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex gap-3 ${
              m.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {/* AI Avatar */}
            {m.role === "assistant" && (
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 flex-shrink-0 mt-1">
                <Sparkles className="w-4 h-4 text-indigo-300" />
              </div>
            )}

            <div
              className={`max-w-[75%] p-4 rounded-2xl text-sm leading-relaxed shadow-lg backdrop-blur-sm ${
                m.role === "user"
                  ? "bg-indigo-600/20 text-indigo-50 border border-indigo-500/30 rounded-tr-none"
                  : "bg-white/5 text-white/80 border border-white/5 rounded-tl-none"
              }`}
            >
              {m.content}
            </div>

            {/* User Avatar */}
            {m.role === "user" && (
              <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 flex-shrink-0 mt-1">
                <User className="w-4 h-4 text-indigo-300" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 flex-shrink-0">
              <Sparkles className="w-4 h-4 text-indigo-300 animate-spin-slow" />
            </div>
            <div className="bg-white/5 px-4 py-3 rounded-2xl rounded-tl-none text-white/40 text-xs flex items-center gap-2">
              <span className="animate-bounce">●</span>
              <span className="animate-bounce delay-100">●</span>
              <span className="animate-bounce delay-200">●</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-white/5 bg-white/[0.02] z-10 backdrop-blur-md">
        <div className="relative flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Ask the stars..."
            className="w-full bg-black/20 border border-white/10 rounded-xl pl-4 pr-12 py-3.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all shadow-inner"
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="absolute right-2 p-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-all disabled:opacity-0 disabled:scale-75 shadow-lg shadow-indigo-500/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <div className="text-center mt-2">
          <p className="text-[10px] text-white/20 uppercase tracking-widest">
            AI can make mistakes. Astrology cannot
          </p>
        </div>
      </div>
    </div>
  );
}
