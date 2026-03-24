"use client";

import { useState } from "react";

interface CodeBlockProps {
  code: string;
  language?: string;
}

export function CodeBlock({ code, language }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group rounded-lg overflow-hidden my-3">
      {language && (
        <div className="flex items-center justify-between bg-zinc-800 px-4 py-1.5 text-xs text-zinc-400">
          <span>{language}</span>
          <button
            onClick={handleCopy}
            className="opacity-0 group-hover:opacity-100 transition-opacity text-xs text-zinc-400 hover:text-zinc-200"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      )}
      <pre className="bg-zinc-900 border border-zinc-800 p-4 overflow-x-auto text-sm">
        <code>{code}</code>
      </pre>
    </div>
  );
}
