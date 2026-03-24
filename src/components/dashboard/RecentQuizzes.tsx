import { getRecentQuizAttempts } from "@/lib/curriculum/queries";
import { Card, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export async function RecentQuizzes() {
  const attempts = await getRecentQuizAttempts();

  if (attempts.length === 0) {
    return (
      <Card>
        <CardTitle className="text-base mb-2">Recent Quizzes</CardTitle>
        <p className="text-sm text-zinc-500">No quiz attempts yet.</p>
      </Card>
    );
  }

  return (
    <Card>
      <CardTitle className="text-base mb-4">Recent Quizzes</CardTitle>
      <div className="space-y-3">
        {attempts.map((attempt) => (
          <div
            key={attempt.id}
            className="flex items-center justify-between py-2 border-b border-zinc-800 last:border-0"
          >
            <div>
              <p className="text-sm text-zinc-200">{attempt.topic.title}</p>
              <p className="text-xs text-zinc-500">
                Month {attempt.topic.week.month.id} · Week{" "}
                {attempt.topic.week.weekNum}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-zinc-300">
                {Math.round(attempt.score)}%
              </span>
              <Badge variant={attempt.passed ? "success" : "warning"}>
                {attempt.passed ? "PASS" : "FAIL"}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
