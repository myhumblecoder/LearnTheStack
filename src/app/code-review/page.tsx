"use client";

import { useEffect, useState } from "react";
import { ChatPanel } from "@/components/chat/ChatPanel";
import { Badge } from "@/components/ui/Badge";

interface TopicOption {
  id: number;
  title: string;
  monthId: number;
  weekNum: number;
}

export default function CodeReviewPage() {
  const [topics, setTopics] = useState<TopicOption[]>([]);
  const [selectedTopicId, setSelectedTopicId] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/topic/list")
      .then((r) => r.json())
      .then((data) => {
        setTopics(data);
        if (data.length > 0) setSelectedTopicId(data[0].id);
      });
  }, []);

  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-zinc-800 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <Badge variant="info">Code Review Mode</Badge>
          </div>
          <h1 className="text-xl font-bold text-zinc-100 mb-3">Code Review</h1>
          <p className="text-sm text-zinc-400 mb-3">
            Paste your code and get contextual feedback based on the current learning objectives.
          </p>

          <select
            value={selectedTopicId ?? ""}
            onChange={(e) => setSelectedTopicId(Number(e.target.value))}
            className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            {topics.map((t) => (
              <option key={t.id} value={t.id}>
                M{t.monthId} W{t.weekNum} — {t.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex-1 max-w-4xl mx-auto w-full">
        {selectedTopicId && (
          <ChatPanel
            key={selectedTopicId}
            topicId={selectedTopicId}
            mode="CODE_REVIEW"
          />
        )}
      </div>
    </div>
  );
}
