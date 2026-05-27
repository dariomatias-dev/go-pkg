"use client";

import { ChevronDown, ChevronUp, Send, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import { MarkdownRenderer } from "./MarkdownRenderer";

interface ChatMessage {
  role: "user" | "model";
  text: string;
}

interface GopherChatProps {
  importPath: string;
  description?: string;
}

export function GopherChat({ importPath, description }: GopherChatProps) {
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
        body: JSON.stringify({
          importPath,
          description,
          message: text,
          history: messages,
        }),
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
    <div className="bg-white dark:bg-[#0d1117] rounded-xl border border-slate-200/60 dark:border-[#30363d] shadow-sm overflow-hidden flex flex-col transition-all duration-300">
      <div
        className="bg-slate-50 dark:bg-[#161b22] border-b border-slate-100 dark:border-[#30363d] px-4 py-3.5 cursor-pointer flex items-center justify-between select-none hover:bg-slate-100/50 dark:hover:bg-[#1c2128] transition-colors"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center space-x-2.5">
          <div className="relative flex items-center">
            <div className="w-8 h-8 rounded-full bg-cyan-50 dark:bg-sky-950/40 border border-cyan-200 dark:border-sky-900/40 flex items-center justify-center text-base select-none shadow-sm">
              🐹
            </div>

            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#00ADD8] border border-white dark:border-[#161b22] rounded-full animate-ping" />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#00ADD8] border border-white dark:border-[#161b22] rounded-full" />
          </div>

          <div className="flex flex-col">
            <h4 className="font-sans font-bold text-xs text-slate-800 dark:text-[#f0f6fc] tracking-tight leading-none">
              Gopher AI Assistant
            </h4>

            <span className="text-[10px] text-[#007D9C] dark:text-sky-400 font-semibold mt-0.5">
              Smart Go Support
            </span>
          </div>
        </div>

        <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-[#21262d] border border-slate-200/50 dark:border-[#30363d] flex items-center justify-center text-slate-500 dark:text-[#8b949e] hover:text-[#007D9C] dark:hover:text-[#f0f6fc] hover:bg-white dark:hover:bg-[#30363d] transition-all shadow-sm">
          {open ? (
            <ChevronUp className="w-3.5 h-3.5" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" />
          )}
        </div>
      </div>

      {open && (
        <div className="flex flex-col h-100 bg-slate-50/30 dark:bg-[#0d1117]">
          <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-3.5 antialiased custom-scrollbar">
            {messages.length <= 1 && (
              <div className="text-center py-4 px-2 space-y-3">
                <p className="text-[11px] text-slate-400 dark:text-[#8b949e] leading-relaxed max-w-50 mx-auto">
                  Ask a question or pick a quick topic below:
                </p>

                <div className="flex flex-col gap-1.5 pt-1">
                  {QUICK_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => setInput(q)}
                      className="text-left text-[11px] text-[#007D9C] dark:text-sky-400 hover:text-[#005F77] dark:hover:text-sky-300 bg-white dark:bg-[#161b22] hover:bg-sky-50 dark:hover:bg-[#21262d] border border-slate-200 dark:border-[#30363d] rounded-lg px-2.5 py-1.5 transition-colors cursor-pointer font-medium truncate"
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
                className={cn(
                  "flex",
                  msg.role === "user" ? "justify-end" : "justify-start",
                )}
              >
                <div className="flex gap-2 items-end max-w-[88%] min-w-0">
                  {msg.role !== "user" && (
                    <div className="w-5 h-5 rounded-full bg-sky-100 dark:bg-sky-950/40 flex items-center justify-center text-[11px] shrink-0 select-none shadow-sm border border-sky-200 dark:border-sky-900/40">
                      🐹
                    </div>
                  )}

                  <div
                    className={cn(
                      "text-xs rounded-xl px-3 py-2 shadow-sm leading-relaxed min-w-0",
                      msg.role === "user"
                        ? "bg-slate-900 dark:bg-[#21262d] text-white rounded-br-none"
                        : "bg-white dark:bg-[#1c2128] text-slate-800 dark:text-[#c9d1d9] border border-slate-200/80 dark:border-[#30363d] rounded-bl-none",
                    )}
                  >
                    {msg.role === "user" ? (
                      <p className="whitespace-pre-wrap wrap-break-word font-sans font-normal">
                        {msg.text}
                      </p>
                    ) : (
                      <MarkdownRenderer content={msg.text} size="xs" />
                    )}
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="flex gap-2 items-end max-w-[85%]">
                  <div className="w-5 h-5 rounded-full bg-sky-100 dark:bg-sky-950/40 flex items-center justify-center text-[11px] shrink-0 select-none shadow-sm">
                    🐹
                  </div>

                  <div className="bg-white dark:bg-[#1c2128] border border-slate-200 dark:border-[#30363d] text-slate-400 dark:text-[#8b949e] text-xs rounded-xl px-3 py-2 rounded-bl-none shadow-sm flex items-center gap-1">
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
            className="p-2 border-t border-slate-100 dark:border-[#30363d] bg-white dark:bg-[#161b22] flex gap-2 items-center select-none"
          >
            <div className="flex-1 relative flex items-center">
              <input
                type="text"
                placeholder="Ask about this package..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full bg-slate-50 dark:bg-[#0d1117] hover:bg-slate-100/50 dark:hover:bg-[#090c10] text-xs rounded-xl pl-3 pr-8 py-2 border border-slate-200 dark:border-[#30363d] focus:outline-none focus:ring-1 focus:ring-[#00ADD8] dark:focus:ring-sky-500 transition-all font-sans text-slate-800 dark:text-[#f0f6fc] placeholder-slate-400 dark:placeholder-[#484f58]"
              />

              {input && (
                <button
                  type="button"
                  onClick={() => setInput("")}
                  className="absolute right-2 text-slate-400 dark:text-[#8b949e] hover:text-slate-600 dark:hover:text-[#f0f6fc] bg-transparent border-none p-0.5 transition-colors cursor-pointer rounded-full"
                  title="Clear"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={!input.trim() || loading}
              className={cn(
                "p-2 rounded-xl transition-all duration-200 active:scale-95 shrink-0 flex items-center justify-center h-8 w-8 shadow-sm border",
                !input.trim() || loading
                  ? "bg-slate-50 dark:bg-[#21262d] text-slate-300 dark:text-[#484f58] border-slate-200/60 dark:border-[#30363d] cursor-not-allowed opacity-50"
                  : "bg-[#007D9C] dark:bg-sky-600 hover:bg-[#005F77] dark:hover:bg-sky-700 text-white border-[#007D9C] dark:border-sky-600 cursor-pointer",
              )}
              title="Send message"
            >
              <Send
                className={cn(
                  "w-3.5 h-3.5",
                  !input.trim() || loading
                    ? "text-slate-300 dark:text-[#484f58]"
                    : "text-white",
                )}
              />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
