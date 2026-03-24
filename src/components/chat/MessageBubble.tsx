"use client";

import { CodeBlock } from "./CodeBlock";

interface MessageBubbleProps {
  role: "user" | "assistant";
  content: string;
}

function parseContent(content: string) {
  const parts: { type: "text" | "code"; content: string; language?: string }[] =
    [];
  const codeBlockRegex = /```(\w*)\n?([\s\S]*?)```/g;
  let lastIndex = 0;
  let match;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: "text", content: content.slice(lastIndex, match.index) });
    }
    parts.push({
      type: "code",
      language: match[1] || undefined,
      content: match[2].trim(),
    });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < content.length) {
    parts.push({ type: "text", content: content.slice(lastIndex) });
  }

  return parts;
}

export function MessageBubble({ role, content }: MessageBubbleProps) {
  const isUser = role === "user";
  const parts = parseContent(content);

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
          isUser
            ? "bg-blue-600 text-white"
            : "bg-zinc-800 text-zinc-200"
        }`}
      >
        {parts.map((part, i) =>
          part.type === "code" ? (
            <CodeBlock key={i} code={part.content} language={part.language} />
          ) : (
            <div
              key={i}
              className="whitespace-pre-wrap text-sm leading-relaxed [&>p]:mb-2"
              dangerouslySetInnerHTML={{
                __html: part.content
                  .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                  .replace(/`([^`]+)`/g, '<code class="bg-zinc-700/50 px-1.5 py-0.5 rounded text-xs">$1</code>')
                  .replace(/\n/g, "<br/>"),
              }}
            />
          )
        )}
      </div>
    </div>
  );
}
