"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useRef, useState, useMemo } from "react";
import { MessageBubble } from "./MessageBubble";
import { Button } from "@/components/ui/Button";
import type { Rating } from "@/actions/feedback";

interface InitialMessage {
  externalId: string;
  role: "user" | "assistant";
  content: string;
  rating?: Rating | null;
}

interface ChatPanelProps {
  topicId: number | null;
  mode: "LESSON" | "QUIZ" | "CODE_REVIEW";
  initialMessages?: InitialMessage[];
  onQuizComplete?: (result: {
    passed: boolean;
    score: number;
    totalQuestions: number;
    correctAnswers: number;
    feedback: string;
  }) => void;
}

export function ChatPanel({
  topicId,
  mode,
  initialMessages = [],
  onQuizComplete,
}: ChatPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [input, setInput] = useState("");

  const autoResize = (el: HTMLTextAreaElement) => {
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 240) + "px";
  };

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        body: { topicId, mode },
      }),
    [topicId, mode]
  );

  const initialRatings = useMemo(() => {
    const map = new Map<string, Rating | null>();
    for (const m of initialMessages) {
      map.set(m.externalId, m.rating ?? null);
    }
    return map;
  }, [initialMessages]);

  const { messages, sendMessage, setMessages, status, error } = useChat({
    id: `${mode}-${topicId ?? "general"}`,
    transport,
    messages: initialMessages.map((m) => ({
      id: m.externalId,
      role: m.role,
      parts: [{ type: "text" as const, text: m.content }],
    })),
    onFinish(event) {
      if (mode === "QUIZ" && onQuizComplete && event.message) {
        const textParts = event.message.parts?.filter(
          (p: { type: string }) => p.type === "text"
        );
        const fullText = textParts
          ?.map((p: { type: string; text?: string }) =>
            "text" in p ? p.text : ""
          )
          .join("");
        if (fullText) {
          const match = fullText.match(
            /```json\s*(\{[\s\S]*?"quizComplete"\s*:\s*true[\s\S]*?\})\s*```/
          );
          if (match) {
            try {
              const result = JSON.parse(match[1]);
              onQuizComplete({
                passed: result.passed,
                score: result.score,
                totalQuestions: result.totalQuestions,
                correctAnswers: result.correctAnswers,
                feedback: result.feedback,
              });
            } catch {
              // Invalid JSON
            }
          }
        }
      }
    },
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const isLoading = status === "streaming" || status === "submitted";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage({ text: input });
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  function getMessageText(msg: (typeof messages)[number]): string {
    return (
      msg.parts
        ?.filter((p): p is { type: "text"; text: string } => p.type === "text")
        .map((p) => p.text)
        .join("") ?? ""
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-1">
        {messages.length === 0 && (
          <div className="text-center text-zinc-500 mt-8">
            {mode === "LESSON" && "Ask me anything about this topic!"}
            {mode === "QUIZ" &&
              "Ready to test your knowledge? Send any message to begin."}
            {mode === "CODE_REVIEW" && "Paste your code and I'll review it."}
          </div>
        )}
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            role={msg.role as "user" | "assistant"}
            content={getMessageText(msg)}
            messageId={msg.id}
            initialRating={initialRatings.get(msg.id) ?? null}
          />
        ))}
        {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
          <div className="flex justify-start mb-4">
            <div className="bg-zinc-800 text-zinc-400 rounded-2xl px-4 py-3 text-sm">
              <span className="animate-pulse">Thinking...</span>
            </div>
          </div>
        )}
        {error && (
          <div className="text-red-400 text-sm text-center py-2">
            Error: {error.message}
          </div>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="border-t border-zinc-800 p-4 flex flex-col gap-2"
      >
        {messages.length > 0 && (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setMessages([])}
              className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              Clear chat
            </button>
          </div>
        )}
        <div className="flex gap-3">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            autoResize(e.target);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
          placeholder={
            mode === "CODE_REVIEW"
              ? "Paste your code here..."
              : "Type your message..."
          }
          className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder-zinc-500 resize-none focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent font-mono"
          rows={2}
          style={{ maxHeight: "15rem" }}
        />
        <Button type="submit" disabled={isLoading || !input.trim()}>
          Send
        </Button>
        </div>
      </form>
    </div>
  );
}
