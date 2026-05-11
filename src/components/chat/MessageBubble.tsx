"use client";

import { useState, useTransition } from "react";
import { CodeBlock } from "./CodeBlock";
import { rateMessage, type Rating } from "@/actions/feedback";

interface MessageBubbleProps {
  role: "user" | "assistant";
  content: string;
  messageId?: string;
  initialRating?: Rating | null;
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

function FeedbackControls({
  messageId,
  initialRating,
}: {
  messageId: string;
  initialRating: Rating | null;
}) {
  const [rating, setRating] = useState<Rating | null>(initialRating);
  const [, startTransition] = useTransition();

  const submit = (next: Rating) => {
    const target = rating === next ? null : next;
    const prev = rating;
    setRating(target);
    startTransition(async () => {
      const res = await rateMessage(messageId, target);
      if (!res.ok) setRating(prev);
    });
  };

  const baseBtn =
    "p-1 rounded text-zinc-500 hover:text-zinc-200 hover:bg-zinc-700/50 transition-colors";
  const activeUp = "text-green-400 hover:text-green-300";
  const activeDown = "text-red-400 hover:text-red-300";

  return (
    <div className="mt-2 flex gap-1 opacity-60 hover:opacity-100 transition-opacity">
      <button
        type="button"
        aria-label="Thumbs up"
        aria-pressed={rating === "UP"}
        onClick={() => submit("UP")}
        className={`${baseBtn} ${rating === "UP" ? activeUp : ""}`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill={rating === "UP" ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.5"
          className="w-4 h-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75A.75.75 0 0 1 14.25 2a2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z"
          />
        </svg>
      </button>
      <button
        type="button"
        aria-label="Thumbs down"
        aria-pressed={rating === "DOWN"}
        onClick={() => submit("DOWN")}
        className={`${baseBtn} ${rating === "DOWN" ? activeDown : ""}`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill={rating === "DOWN" ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.5"
          className="w-4 h-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7.5 15h2.25m8.024-9.75c.011.05.028.1.052.148.591 1.2.924 2.55.924 3.977a8.96 8.96 0 0 1-.999 4.125m.023-8.25c-.076-.365.183-.75.575-.75h.908c.889 0 1.713.518 1.972 1.368.339 1.11.521 2.287.521 3.507 0 1.553-.295 3.036-.831 4.398-.306.774-1.086 1.227-1.918 1.227h-1.053c-.472 0-.745-.556-.5-.96a8.95 8.95 0 0 0 .303-.54m.023-8.25H16.48a4.5 4.5 0 0 1-1.423-.23l-3.114-1.04a4.5 4.5 0 0 0-1.423-.23H6.504c-.618 0-1.217.247-1.605.729A11.95 11.95 0 0 0 2.25 12c0 .434.023.863.068 1.285C2.427 14.306 3.346 15 4.372 15h3.126c.618 0 .991.724.725 1.282A7.471 7.471 0 0 0 7.5 19.5a2.25 2.25 0 0 0 2.25 2.25.75.75 0 0 0 .75-.75v-.633c0-.573.11-1.14.322-1.672.304-.76.93-1.33 1.653-1.715a9.04 9.04 0 0 0 2.86-2.4c.498-.634 1.226-1.08 2.032-1.08h.384"
          />
        </svg>
      </button>
    </div>
  );
}

export function MessageBubble({
  role,
  content,
  messageId,
  initialRating = null,
}: MessageBubbleProps) {
  const isUser = role === "user";
  const parts = parseContent(content);
  const showFeedback = !isUser && !!messageId;

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
        {showFeedback && (
          <FeedbackControls
            messageId={messageId!}
            initialRating={initialRating}
          />
        )}
      </div>
    </div>
  );
}
