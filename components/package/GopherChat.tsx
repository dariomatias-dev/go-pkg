"use client";

import { ChevronDown, ChevronUp, Send, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface ChatMessage {
  role: "user" | "model";
  text: string;
}

interface GopherChatProps {
  importPath: string;
}

export function GopherChat({ importPath }: GopherChatProps) {
  const [open, setOpen] = useState(true);
  const [prevModulePath, setPrevModulePath] = useState(importPath);
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      role: "model",
      text: `Hello! I'm Gopher AI. I can help with code examples, architecture questions, or how to integrate **${importPath}** into your Go project. What would you like to know?`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  if (prevModulePath !== importPath) {
    setPrevModulePath(importPath);
    setMessages([
      {
        role: "model",
        text: `Hello! I'm Gopher AI. I can help with code examples, architecture questions, or how to integrate **${importPath}** into your Go project. What would you like to know?`,
      },
    ]);
  }

  const prevMessagesLen = useRef(messages.length);
  useEffect(() => {
    if (messages.length > prevMessagesLen.current || loading) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    prevMessagesLen.current = messages.length;
  }, [messages, loading]);

  const sendMessage = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!input.trim() || loading) return;

    const text = input.trim();

    setInput("");

    const updated: ChatMessage[] = [...messages, { role: "user", text }];

    setMessages(updated);
    setLoading(true);

    try {
      const res = await fetch("/api/package-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ importPath, message: text, history: messages }),
      });

      const d = await res.json();

      setMessages([
        ...updated,
        {
          role: "model",
          text: res.ok ? d.text : "An error occurred. Please try again.",
        },
      ]);
    } catch {
      setMessages([
        ...updated,
        { role: "model", text: "No response from server. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const QUICK_QUESTIONS = [
    "How to import and use?",
    "Simple code example",
    "What are the advantages?",
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden flex flex-col transition-all duration-300">
      <div
        className="bg-slate-50 border-b border-slate-100 px-4 py-3.5 cursor-pointer flex items-center justify-between select-none hover:bg-slate-100/50 transition-colors"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center space-x-2.5">
          <div className="relative flex items-center">
            <div className="w-8 h-8 rounded-full bg-cyan-50 border border-cyan-200 flex items-center justify-center text-base select-none shadow-sm">
              🐹
            </div>

            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#00ADD8] border border-white rounded-full animate-ping" />

            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#00ADD8] border border-white rounded-full" />
          </div>

          <div className="flex flex-col">
            <h4 className="font-sans font-bold text-xs text-slate-800 tracking-tight leading-none">
              Gopher AI Assistant
            </h4>

            <span className="text-[10px] text-[#007D9C] font-semibold mt-0.5">
              Smart Go Support
            </span>
          </div>
        </div>

        <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200/50 flex items-center justify-center text-slate-500 hover:text-[#007D9C] hover:bg-white transition-all shadow-sm">
          {open ? (
            <ChevronUp className="w-3.5 h-3.5" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" />
          )}
        </div>
      </div>

      {open && (
        <div className="flex flex-col h-100 bg-slate-50/30">
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 antialiased">
            {messages.length <= 1 && (
              <div className="text-center py-4 px-2 space-y-3">
                <p className="text-[11px] text-slate-400 leading-relaxed max-w-50 mx-auto">
                  Ask a question or pick a quick topic below:
                </p>

                <div className="flex flex-col gap-1.5 pt-1">
                  {QUICK_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => setInput(q)}
                      className="text-left text-[11px] text-[#007D9C] hover:text-[#005F77] bg-white hover:bg-sky-50 border border-slate-200 rounded-lg px-2.5 py-1.5 transition-colors cursor-pointer font-medium truncate"
                    >
                      💡 {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className="flex gap-2 items-end max-w-[88%]">
                  {msg.role !== "user" && (
                    <div className="w-5 h-5 rounded-full bg-sky-100 flex items-center justify-center text-[11px] shrink-0 select-none shadow-sm border border-sky-200">
                      🐹
                    </div>
                  )}

                  <div
                    className={`text-xs rounded-xl px-3 py-2 shadow-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-slate-900 text-white rounded-br-none"
                        : "bg-white text-slate-800 border border-slate-200/80 rounded-bl-none"
                    }`}
                  >
                    <p className="whitespace-pre-wrap font-sans font-normal">
                      {msg.text}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="flex gap-2 items-end max-w-[85%]">
                  <div className="w-5 h-5 rounded-full bg-sky-100 flex items-center justify-center text-[11px] shrink-0 select-none shadow-sm">
                    🐹
                  </div>

                  <div className="bg-white border border-slate-200 text-slate-400 text-xs rounded-xl px-3 py-2 rounded-bl-none shadow-sm flex items-center gap-1">
                    {[0, 150, 300].map((delay) => (
                      <div
                        key={delay}
                        className="w-1 h-1 bg-[#00ADD8] rounded-full animate-bounce"
                        style={{ animationDelay: `${delay}ms` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          <form
            onSubmit={sendMessage}
            className="p-2 border-t border-slate-100 bg-white flex gap-2 items-center select-none"
          >
            <div className="flex-1 relative flex items-center">
              <input
                type="text"
                placeholder="Ask about this package..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full bg-slate-50 hover:bg-slate-50/80 text-xs rounded-xl pl-3 pr-8 py-2 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#00ADD8] focus:bg-white transition-all font-sans"
              />

              {input && (
                <button
                  type="button"
                  onClick={() => setInput("")}
                  className="absolute right-2 text-slate-400 hover:text-slate-600 bg-transparent border-none p-0.5 transition-colors cursor-pointer rounded-full"
                  title="Clear"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={!input.trim() || loading}
              className={`p-2 rounded-xl transition-all duration-200 active:scale-95 shrink-0 flex items-center justify-center h-8 w-8 shadow-sm border ${
                !input.trim() || loading
                  ? "bg-slate-50 text-slate-300 border-slate-200/60 cursor-not-allowed opacity-50"
                  : "bg-[#007D9C] hover:bg-[#005F77] text-white border-[#007D9C] cursor-pointer"
              }`}
              title="Send message"
            >
              <Send
                className={`w-3.5 h-3.5 ${!input.trim() || loading ? "text-slate-300" : "text-white"}`}
              />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
