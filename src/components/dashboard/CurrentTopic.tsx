import Link from "next/link";
import { getCurrentTopic } from "@/lib/curriculum/progression";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export async function CurrentTopic() {
  const topic = await getCurrentTopic();

  if (!topic) {
    return (
      <Card className="border-green-800 bg-green-950/20">
        <CardHeader>
          <CardTitle>Curriculum Complete!</CardTitle>
        </CardHeader>
        <p className="text-zinc-400">
          You&apos;ve completed all topics. Congratulations!
        </p>
      </Card>
    );
  }

  const status = topic.progress?.status ?? "NOT_STARTED";

  return (
    <Card className="border-blue-800/50 bg-gradient-to-br from-blue-950/30 to-zinc-900">
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <Badge variant="info">
            Month {topic.week.month.id} · Week {topic.week.weekNum}
          </Badge>
          <Badge variant={status === "IN_PROGRESS" ? "warning" : "muted"}>
            {status.replace("_", " ")}
          </Badge>
        </div>
        <CardTitle className="text-xl">{topic.title}</CardTitle>
      </CardHeader>
      <p className="text-sm text-zinc-400 mb-4 line-clamp-2">
        {topic.content}
      </p>
      <div className="flex gap-3">
        <Link href={`/lesson/${topic.id}`}>
          <Button>Continue Learning</Button>
        </Link>
        {(status === "IN_PROGRESS" || status === "QUIZ_PENDING") && (
          <Link href={`/quiz/${topic.id}`}>
            <Button variant="secondary">Take Quiz</Button>
          </Link>
        )}
      </div>
    </Card>
  );
}
