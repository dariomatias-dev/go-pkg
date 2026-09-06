"use client";

import { ExternalLink } from "lucide-react";
import Image from "next/image";
import React, { useContext } from "react";

import {
  InListContext,
  MarkdownRenderer,
} from "@/components/package/shared/MarkdownRenderer";

interface ReadmeTabProps {
  readme: string;
  githubUrl?: string;
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

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  node?: unknown;
}

function ReadmeLink({ href, children, ...props }: LinkProps) {
  const inList = useContext(InListContext);

  if (!href) return null;

  if (!inList) {
    const ytMatch = href.match(
      /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/ ]{11})/,
    );

    if (ytMatch?.[1]) {
      const videoId = ytMatch[1];
      return (
        <span className="relative mx-auto my-6 block w-full max-w-2xl">
          <span className="relative block aspect-video w-full overflow-hidden rounded-xl border border-slate-200/80 shadow-md dark:border-[#30363d]">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              title="YouTube video player"
              className="absolute top-0 left-0 h-full w-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </span>

          <span className="mt-2 flex items-center justify-between px-1">
            <span className="font-mono text-[11px] text-slate-400 dark:text-slate-500">
              YouTube ID: {videoId}
            </span>

            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs font-semibold text-[#00ADD8] hover:text-[#007D9C] hover:underline dark:text-sky-400 dark:hover:text-sky-300"
            >
              Watch on YouTube <ExternalLink className="h-3 w-3" />
            </a>
          </span>
        </span>
      );
    }
  }

  const isAnchor = href.startsWith("#");

  return (
    <a
      href={href}
      target={isAnchor ? undefined : "_blank"}
      rel={isAnchor ? undefined : "noopener noreferrer"}
      className="font-bold break-all text-[#00ADD8] underline decoration-[#00ADD8]/30 decoration-2 underline-offset-4 transition-all hover:text-[#007D9C] hover:decoration-[#007D9C] dark:text-sky-400 dark:decoration-sky-400/30 dark:hover:text-sky-300 dark:hover:decoration-sky-300"
      {...props}
    >
      {children}
    </a>
  );
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
    <div className="markdown-body">
      <MarkdownRenderer
        content={readme}
        useRehypeRaw
        extraComponents={{
          a: ReadmeLink,
          img: ({ src, alt }) => {
            const resolvedSrc = resolveImageUrl(
              typeof src === "string" ? src : undefined,
              githubUrl,
            );

            if (!resolvedSrc) return null;

            const srcStr = src?.toString() || "";
            const isBadge =
              srcStr.includes("badge") ||
              srcStr.includes("shield") ||
              srcStr.includes("img.shields.io") ||
              srcStr.includes(".svg");

            if (isBadge) {
              return (
                <Image
                  src={resolvedSrc}
                  alt={alt || "badge"}
                  width={120}
                  height={20}
                  className="my-1 mr-1 inline-block align-middle"
                  style={{ height: "20px", width: "auto" }}
                />
              );
            }

            return (
              <Image
                src={resolvedSrc}
                alt={alt || "image"}
                width={1200}
                height={630}
                className="mx-auto my-6 block max-w-full rounded-lg shadow-sm"
                style={{ height: "auto", width: "auto" }}
              />
            );
          },
        }}
      />
    </div>
  );
}
