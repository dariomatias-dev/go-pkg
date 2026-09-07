"use client";

import { ChevronDown, ChevronUp, Send, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

import { MarkdownRenderer } from "./MarkdownRenderer";

interface ChatMessage {
  id: string;
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
      id: crypto.randomUUID(),
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
        id: crypto.randomUUID(),
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

    const updated: ChatMessage[] = [
      ...messages,
      { id: crypto.randomUUID(), role: "user", text },
    ];

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
          id: crypto.randomUUID(),
          role: "model",
          text: res.ok ? d.text : "An error occurred. Please try again.",
        },
      ]);
    } catch {
      setMessages([
        ...updated,
        {
          id: crypto.randomUUID(),
          role: "model",
          text: "No response from server. Please try again.",
        },
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
    <div className="flex flex-col overflow-hidden rounded-xl border border-slate-200/60 bg-white shadow-sm transition-all duration-300 dark:border-[#30363d] dark:bg-[#0d1117]">
      <button
        type="button"
        aria-expanded={open}
        className="flex w-full cursor-pointer items-center justify-between border-b border-slate-100 bg-slate-50 px-4 py-3.5 text-left transition-colors select-none hover:bg-slate-100/50 dark:border-[#30363d] dark:bg-[#161b22] dark:hover:bg-[#1c2128]"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center space-x-2.5">
          <div className="relative flex items-center">
            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-cyan-200 bg-cyan-50 text-base shadow-sm select-none dark:border-sky-900/40 dark:bg-sky-950/40">
              🐹
            </div>

            <span className="absolute right-0 bottom-0 h-2.5 w-2.5 animate-ping rounded-full border border-white bg-[#00ADD8] dark:border-[#161b22]" />
            <span className="absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full border border-white bg-[#00ADD8] dark:border-[#161b22]" />
          </div>

          <div className="flex flex-col">
            <h4 className="font-sans text-xs leading-none font-bold tracking-tight text-slate-800 dark:text-[#f0f6fc]">
              Gopher AI Assistant
            </h4>

            <span className="mt-0.5 text-[10px] font-semibold text-[#006680] dark:text-sky-400">
              Smart Go Support
            </span>
          </div>
        </div>

        <div className="flex h-6 w-6 items-center justify-center rounded-full border border-slate-200/50 bg-slate-100 text-slate-500 shadow-sm transition-all hover:bg-white hover:text-[#006680] dark:border-[#30363d] dark:bg-[#21262d] dark:text-[#8b949e] dark:hover:bg-[#30363d] dark:hover:text-[#f0f6fc]">
          {open ? (
            <ChevronUp className="h-3.5 w-3.5" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5" />
          )}
        </div>
      </button>

      {open && (
        <div className="flex h-100 flex-col bg-slate-50/30 dark:bg-[#0d1117]">
          <div className="custom-scrollbar flex-1 space-y-3.5 overflow-x-hidden overflow-y-auto p-4 antialiased">
            {messages.length <= 1 && (
              <div className="space-y-3 px-2 py-4 text-center">
                <p className="mx-auto max-w-50 text-[11px] leading-relaxed text-slate-500 dark:text-[#8b949e]">
                  Ask a question or pick a quick topic below:
                </p>

                <div className="flex flex-col gap-1.5 pt-1">
                  {QUICK_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => setInput(q)}
                      className="cursor-pointer truncate rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-left text-[11px] font-medium text-[#006680] transition-colors hover:bg-sky-50 hover:text-[#005F77] dark:border-[#30363d] dark:bg-[#161b22] dark:text-sky-400 dark:hover:bg-[#21262d] dark:hover:text-sky-300"
                    >
                      💡 {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex",
                  msg.role === "user" ? "justify-end" : "justify-start",
                )}
              >
                <div className="flex max-w-[88%] min-w-0 items-end gap-2">
                  {msg.role !== "user" && (
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-sky-200 bg-sky-100 text-[11px] shadow-sm select-none dark:border-sky-900/40 dark:bg-sky-950/40">
                      🐹
                    </div>
                  )}

                  <div
                    className={cn(
                      "min-w-0 rounded-xl px-3 py-2 text-xs leading-relaxed wrap-break-word shadow-sm",
                      msg.role === "user"
                        ? "rounded-br-none bg-slate-900 text-white dark:bg-[#21262d]"
                        : "rounded-bl-none border border-slate-200/80 bg-white text-slate-800 dark:border-[#30363d] dark:bg-[#1c2128] dark:text-[#c9d1d9]",
                    )}
                  >
                    {msg.role === "user" ? (
                      <p className="font-sans font-normal wrap-break-word whitespace-pre-wrap">
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
                <div className="flex max-w-[85%] items-end gap-2">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sky-100 text-[11px] shadow-sm select-none dark:bg-sky-950/40">
                    🐹
                  </div>

                  <div className="flex items-center gap-1 rounded-xl rounded-bl-none border border-slate-200 bg-white px-3 py-2 text-xs text-slate-400 shadow-sm dark:border-[#30363d] dark:bg-[#1c2128] dark:text-[#8b949e]">
                    {[0, 150, 300].map((delay) => (
                      <div
                        key={delay}
                        className="h-1 w-1 animate-bounce rounded-full bg-[#00ADD8]"
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
            className="flex items-center gap-2 border-t border-slate-100 bg-white p-2 select-none dark:border-[#30363d] dark:bg-[#161b22]"
          >
            <div className="relative flex flex-1 items-center">
              <input
                type="text"
                aria-label="Ask about this package"
                placeholder="Ask about this package..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pr-8 pl-3 font-sans text-xs text-slate-800 placeholder-slate-400 transition-all hover:bg-slate-100/50 focus:ring-1 focus:ring-[#00ADD8] focus:outline-none dark:border-[#30363d] dark:bg-[#0d1117] dark:text-[#f0f6fc] dark:placeholder-[#484f58] dark:hover:bg-[#090c10] dark:focus:ring-sky-500"
              />

              {input && (
                <button
                  type="button"
                  onClick={() => setInput("")}
                  className="absolute right-2 cursor-pointer rounded-full border-none bg-transparent p-0.5 text-slate-400 transition-colors hover:text-slate-600 dark:text-[#8b949e] dark:hover:text-[#f0f6fc]"
                  title="Clear"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={!input.trim() || loading}
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border p-2 shadow-sm transition-all duration-200 active:scale-95",
                !input.trim() || loading
                  ? "cursor-not-allowed border-slate-200/60 bg-slate-50 text-slate-300 opacity-50 dark:border-[#30363d] dark:bg-[#21262d] dark:text-[#484f58]"
                  : "cursor-pointer border-[#006680] bg-[#006680] text-white hover:bg-[#005F77] dark:border-sky-600 dark:bg-sky-600 dark:hover:bg-sky-700",
              )}
              title="Send message"
            >
              <Send
                className={cn(
                  "h-3.5 w-3.5",
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
