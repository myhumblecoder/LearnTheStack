"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { ChatPanel } from "@/components/chat/ChatPanel";
import { QuizResults } from "@/components/quiz/QuizResults";
import { Badge } from "@/components/ui/Badge";
import { submitQuizResult } from "@/actions/quiz";
import { setQuizPending } from "@/actions/progress";

interface TopicInfo {
  id: number;
  title: string;
  content: string;
  type: string;
  week: { weekNum: number; month: { id: number; title: string }; title: string };
}

interface QuizResultData {
  passed: boolean;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  feedback: string;
}

export default function QuizPage() {
  const params = useParams();
  const topicId = parseInt(params.topicId as string, 10);
  const [topic, setTopic] = useState<TopicInfo | null>(null);
  const [result, setResult] = useState<QuizResultData | null>(null);
  const [nextTopicId, setNextTopicId] = useState<number | null>(null);

  useEffect(() => {
    fetch(`/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topicId, mode: "QUIZ", messages: [], prefetch: true }),
    });
    // Fetch topic info
    async function load() {
      const res = await fetch(`/api/topic/${topicId}`);
      if (res.ok) {
        const data = await res.json();
        setTopic(data.topic);
        setNextTopicId(data.nextTopicId);
      }
      await setQuizPending(topicId);
    }
    load();
  }, [topicId]);

  const handleQuizComplete = useCallback(
    async (data: QuizResultData) => {
      setResult(data);
      await submitQuizResult(
        topicId,
        data.score,
        data.totalQuestions,
        data.correctAnswers,
        data.feedback
      );
    },
    [topicId]
  );

  if (!topic) {
    return (
      <div className="flex items-center justify-center h-full text-zinc-500">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-zinc-800 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <Badge variant="warning">Quiz Mode</Badge>
            <Badge variant="info">
              Month {topic.week.month.id} · Week {topic.week.weekNum}
            </Badge>
          </div>
          <h1 className="text-xl font-bold text-zinc-100">{topic.title}</h1>
          <p className="text-xs text-zinc-500 mt-1">
            Score 70% or higher to advance to the next topic.
          </p>
        </div>
      </div>

      {result ? (
        <div className="max-w-lg mx-auto mt-8">
          <QuizResults
            {...result}
            topicId={topicId}
            nextTopicId={nextTopicId}
          />
        </div>
      ) : (
        <div className="flex-1 max-w-4xl mx-auto w-full">
          <ChatPanel
            topicId={topicId}
            mode="QUIZ"
            onQuizComplete={handleQuizComplete}
          />
        </div>
      )}
    </div>
  );
}
