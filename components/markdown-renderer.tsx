"use client";

import React, { useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";
import { supabase } from "@/supabase-client";
import { useQueries, useQuery } from "@tanstack/react-query";

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const components = {
    h1: ({ children }: { children?: React.ReactNode }) => (
      <h1 className="mb-6 text-4xl font-bold text-foreground">{children}</h1>
    ),
    h2: ({ children }: { children?: React.ReactNode }) => (
      <h2 className="mb-4 mt-8 text-3xl font-bold text-foreground">
        {children}
      </h2>
    ),
    h3: ({ children }: { children?: React.ReactNode }) => (
      <h3 className="mb-3 mt-6 text-2xl font-semibold text-foreground">
        {children}
      </h3>
    ),
    p: ({ children }: { children?: React.ReactNode }) => (
      <p className="mb-4 leading-relaxed text-foreground/90">{children}</p>
    ),
    ul: ({ children }: { children?: React.ReactNode }) => (
      <ul className="mb-4 ml-6 list-disc space-y-2 text-foreground/90">
        {children}
      </ul>
    ),
    ol: ({ children }: { children?: React.ReactNode }) => (
      <ol className="mb-4 ml-6 list-decimal space-y-2 text-foreground/90">
        {children}
      </ol>
    ),
    li: ({ children }: { children?: React.ReactNode }) => (
      <li className="leading-relaxed">{children}</li>
    ),
    blockquote: ({ children }: { children?: React.ReactNode }) => (
      <blockquote className="my-4 border-l-4 border-primary pl-4 italic text-muted-foreground">
        {children}
      </blockquote>
    ),
    code: ({
      inline,
      className,
      children,
      ...props
    }: {
      inline?: boolean;
      className?: string;
      children?: React.ReactNode;
      [key: string]: unknown;
    }) => {
      const match = /language-(\w+)/.exec(className || "");
      return !inline && match ? (
        <pre className="my-4 overflow-x-auto rounded-lg border border-border bg-secondary/50 p-4">
          <code className="font-mono text-sm text-foreground/90" {...props}>
            {children}
          </code>
        </pre>
      ) : (
        <code
          className="rounded bg-secondary px-1.5 py-0.5 font-mono text-sm text-primary"
          {...props}
        >
          {children}
        </code>
      );
    },
    img: ({ src, alt }: { src?: string; alt?: string }) => {
      const storagePath = src?.replace(/^\/gallery\//, "") ?? "";
      const { data } = supabase.storage
        .from("gallery")
        .getPublicUrl(storagePath);

      return (
        <img
          src={data.publicUrl}
          alt={alt || ""}
          className="my-6 rounded-lg border border-border"
        />
      );
    },
    a: ({ href, children }: { href?: string; children?: React.ReactNode }) => (
      <a
        href={href}
        className="text-primary underline-offset-4 hover:underline"
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    ),
    table: ({ children }: { children?: React.ReactNode }) => (
      <div className="my-6 overflow-x-auto">
        <table className="w-full border-collapse border border-border">
          {children}
        </table>
      </div>
    ),
    th: ({ children }: { children?: React.ReactNode }) => (
      <th className="border border-border bg-secondary px-4 py-2 text-left font-semibold">
        {children}
      </th>
    ),
    td: ({ children }: { children?: React.ReactNode }) => (
      <td className="border border-border px-4 py-2">{children}</td>
    ),
  };

  return (
    <div className="prose prose-invert prose-green max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={components as Components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
