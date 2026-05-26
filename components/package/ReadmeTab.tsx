"use client";

import { ExternalLink } from "lucide-react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

import { CodeBlock } from "@/components/package/CodeBlock";

interface ReadmeTabProps {
  readme: string;
  githubUrl?: string;
}

function preprocessReadme(readme: string): string {
  if (!readme) return "";

  let p = readme;

  p = p.replace(/<div(?: [^>]*)?>/gi, "\n\n");
  p = p.replace(/<\/div>/gi, "\n\n");
  p = p.replace(/<p(?: [^>]*)?>/gi, "\n\n");
  p = p.replace(/<\/p>/gi, "\n\n");
  p = p.replace(/<h1(?: [^>]*)?>([\s\S]*?)<\/h1>/gi, "\n# $1\n");
  p = p.replace(/<h2(?: [^>]*)?>([\s\S]*?)<\/h2>/gi, "\n## $1\n");
  p = p.replace(/<h3(?: [^>]*)?>([\s\S]*?)<\/h3>/gi, "\n### $1\n");
  p = p.replace(/<h4(?: [^>]*)?>([\s\S]*?)<\/h4>/gi, "\n#### $1\n");
  p = p.replace(
    /<img[^>]*src="([^"]+)"[^>]*alt="([^"]*)"[^>]*>/gi,
    "![$2]($1)",
  );
  p = p.replace(
    /<img[^>]*alt="([^"]*)"[^>]*src="([^"]+)"[^>]*>/gi,
    "![$1]($2)",
  );
  p = p.replace(/<img[^>]*src="([^"]+)"[^>]*>/gi, "![]($1)");
  p = p.replace(/<br\s*\/?>/gi, "\n");
  p = p.replace(/<a[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi, "[$2]($1)");

  return p;
}

function resolveImageUrl(
  src: string | undefined,
  githubUrl: string | undefined,
): string {
  if (!src) return "";

  if (/^(https?:|data:)/.test(src)) return src;

  if (githubUrl) {
    const repo = githubUrl.replace("https://github.com/", "");
    const normalized = src.startsWith("./") ? src.slice(2) : src;

    return `https://raw.githubusercontent.com/${repo}/master/${normalized}`;
  }

  return src;
}

export function ReadmeTab({ readme, githubUrl }: ReadmeTabProps) {
  if (!readme) {
    return (
      <div className="py-12 text-center text-slate-400 dark:text-slate-500">
        No README or documentation provided by the maintainer.
      </div>
    );
  }

  return (
    <div className="markdown-body divide-y divide-slate-100 dark:divide-[#30363d] space-y-4">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          pre: ({ children }) => (
            <div className="dark:text-[#e6edf3]">{children}</div>
          ),
          code({ className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            const language = match ? match[1] : "";
            const codeString = String(children).replace(/\n$/, "");
            const isInline = !className && !codeString.includes("\n");

            if (!isInline) {
              return (
                <CodeBlock code={codeString} language={language || "go"} />
              );
            }

            return (
              <code
                className="bg-slate-100 dark:bg-[#161b22] text-slate-800 dark:text-[#e6edf3] text-xs px-1.5 py-0.5 rounded font-mono font-bold"
                {...props}
              >
                {children}
              </code>
            );
          },
          a: ({ href, children, ...props }) => {
            if (!href) return null;

            const ytMatch = href.match(
              /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/ ]{11})/,
            );

            if (ytMatch?.[1]) {
              const videoId = ytMatch[1];

              return (
                <span className="block relative w-full max-w-2xl mx-auto my-6">
                  <span className="block relative w-full aspect-video rounded-xl overflow-hidden border border-slate-200/80 dark:border-[#30363d] shadow-md">
                    <iframe
                      src={`https://www.youtube.com/embed/${videoId}`}
                      title="YouTube video player"
                      className="absolute top-0 left-0 w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </span>

                  <span className="flex justify-between items-center mt-2 px-1">
                    <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">
                      YouTube ID: {videoId}
                    </span>

                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-[#00ADD8] dark:text-sky-400 hover:text-[#007D9C] dark:hover:text-sky-300 font-semibold hover:underline flex items-center gap-1"
                    >
                      Watch on YouTube <ExternalLink className="w-3 h-3" />
                    </a>
                  </span>
                </span>
              );
            }

            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#00ADD8] dark:text-sky-400 font-bold underline decoration-[#00ADD8]/30 dark:decoration-sky-400/30 hover:decoration-[#007D9C] dark:hover:decoration-sky-300 decoration-2 underline-offset-4 hover:text-[#007D9C] dark:hover:text-sky-300 transition-all break-all"
                {...props}
              >
                {children}
              </a>
            );
          },
          h1: ({ children }) => (
            <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-[#f0f6fc]! mt-6 mb-3 border-b border-slate-100 dark:border-[#30363d] pb-2">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl font-semibold font-display text-slate-800 dark:text-[#f0f6fc]! mt-5 mb-2.5">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg font-medium text-slate-800 dark:text-[#f0f6fc]! mt-4 mb-2">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="text-slate-600 dark:text-[#c9d1d9] text-sm leading-relaxed mb-4">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc pl-5 mb-4 text-slate-600 dark:text-[#c9d1d9] text-sm space-y-1">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal pl-5 mb-4 text-slate-600 dark:text-[#c9d1d9] text-sm space-y-1">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="leading-relaxed font-sans text-sm text-slate-600 dark:text-[#c9d1d9]">
              {children}
            </li>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-[#00ADD8] dark:border-sky-600 bg-sky-50/15 dark:bg-sky-950/10 p-3.5 my-4 rounded-r text-slate-700 dark:text-[#c9d1d9] italic font-light">
              {children}
            </blockquote>
          ),
          table: ({ children }) => (
            <span className="block overflow-x-auto my-6 border border-slate-200/80 dark:border-[#30363d] rounded-xl shadow-sm">
              <table className="min-w-full divide-y divide-slate-200 dark:divide-[#30363d] text-sm">
                {children}
              </table>
            </span>
          ),
          thead: ({ children }) => (
            <thead className="bg-slate-50 dark:bg-[#161b22]">{children}</thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-slate-200 dark:divide-[#30363d] bg-white dark:bg-[#0d1117]">
              {children}
            </tbody>
          ),
          tr: ({ children }) => (
            <tr className="hover:bg-slate-50/30 dark:hover:bg-[#161b22]/50 transition-colors">
              {children}
            </tr>
          ),
          th: ({ children }) => (
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 dark:text-[#f0f6fc] uppercase tracking-wider">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-3 text-slate-600 dark:text-[#c9d1d9] font-light select-text">
              {children}
            </td>
          ),
          img: ({ src, alt }) => {
            const resolvedSrc = resolveImageUrl(
              typeof src === "string" ? src : undefined,
              githubUrl,
            );

            const srcStr = src?.toString() || "";
            const isBadge =
              srcStr.includes("badge") ||
              srcStr.includes("shield") ||
              srcStr.includes("img.shields.io") ||
              srcStr.includes(".svg");

            if (isBadge) {
              return (
                <span className="inline-block align-middle my-1 mr-1">
                  <Image
                    src={resolvedSrc}
                    alt={alt || "badge"}
                    width={0}
                    height={0}
                    sizes="100vw"
                    unoptimized
                    style={{ width: "auto", height: "20px" }}
                  />
                </span>
              );
            }

            return (
              <span className="my-6 block mx-auto text-center">
                <Image
                  src={resolvedSrc}
                  alt={alt || "image"}
                  width={0}
                  height={0}
                  sizes="100vw"
                  unoptimized
                  style={{ width: "100%", height: "auto", maxWidth: "100%" }}
                  className="rounded-lg shadow-sm"
                />
              </span>
            );
          },
        }}
      >
        {preprocessReadme(readme)}
      </ReactMarkdown>
    </div>
  );
}
