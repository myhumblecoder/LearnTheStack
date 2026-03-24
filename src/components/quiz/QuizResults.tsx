"use client";

import { Card, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

interface QuizResultsProps {
  passed: boolean;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  feedback: string;
  topicId: number;
  nextTopicId?: number | null;
}

export function QuizResults({
  passed,
  score,
  totalQuestions,
  correctAnswers,
  feedback,
  topicId,
  nextTopicId,
}: QuizResultsProps) {
  return (
    <Card
      className={`border ${passed ? "border-green-800 bg-green-950/20" : "border-yellow-800 bg-yellow-950/20"}`}
    >
      <div className="text-center mb-4">
        <Badge variant={passed ? "success" : "warning"} className="text-base px-4 py-1">
          {passed ? "PASSED" : "NOT YET"}
        </Badge>
      </div>

      <CardTitle className="text-center text-2xl mb-2">
        {Math.round(score)}%
      </CardTitle>

      <p className="text-center text-sm text-zinc-400 mb-4">
        {correctAnswers} of {totalQuestions} correct
      </p>

      <p className="text-sm text-zinc-300 mb-6">{feedback}</p>

      <div className="flex justify-center gap-3">
        {passed && nextTopicId ? (
          <Link href={`/lesson/${nextTopicId}`}>
            <Button>Next Topic</Button>
          </Link>
        ) : !passed ? (
          <Link href={`/quiz/${topicId}`}>
            <Button variant="secondary">Try Again</Button>
          </Link>
        ) : (
          <Link href="/">
            <Button>Back to Dashboard</Button>
          </Link>
        )}
      </div>
    </Card>
  );
}
