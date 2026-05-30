import { notFound } from "next/navigation";
import { getTopic, getChatMessages } from "@/lib/curriculum/queries";
import { canAccessTopic } from "@/lib/curriculum/progression";
import { startTopic } from "@/actions/progress";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ChatPanel } from "@/components/chat/ChatPanel";
import Link from "next/link";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ topicId: string }>;
}) {
  const { topicId: topicIdStr } = await params;
  const topicId = parseInt(topicIdStr, 10);
  const topic = await getTopic(topicId);

  if (!topic) notFound();

  const accessible = await canAccessTopic(topicId);
  if (!accessible) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <Card className="text-center py-12">
          <h2 className="text-xl font-semibold text-zinc-100 mb-2">
            Topic Locked
          </h2>
          <p className="text-zinc-400 mb-4">
            Complete the previous topic and pass its quiz to unlock this one.
          </p>
          <Link href="/">
            <Button variant="secondary">Back to Dashboard</Button>
          </Link>
        </Card>
      </div>
    );
  }

  // Auto-start topic if not started
  const status = topic.progress?.status ?? "NOT_STARTED";
  if (status === "NOT_STARTED") {
    await startTopic(topicId);
  }

  const messages = await getChatMessages(topicId, "LESSON");
  const initialMessages = messages.map((m) => ({
    externalId: m.externalId,
    role: m.role as "user" | "assistant",
    content: m.content,
    rating: m.feedback?.rating ?? null,
  }));

  return (
    <div className="flex flex-col h-full">
      {/* Topic header */}
      <div className="border-b border-zinc-800 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <Badge variant="info">
              Month {topic.week.month.id} · Week {topic.week.weekNum}
            </Badge>
            <Badge variant="muted">{topic.type}</Badge>
          </div>
          <h1 className="text-xl font-bold text-zinc-100 mb-2">
            {topic.title}
          </h1>
          <p className="text-sm text-zinc-400 mb-3">{topic.content}</p>

          {topic.resources.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {topic.resources.map((r) => {
                const icon =
                  r.type === "VIDEO" ? "🎥" : r.type === "TEXTBOOK" ? "📚" : "📖";
                const inner = (
                  <span className="inline-flex items-center gap-1.5 text-xs rounded-md border border-zinc-700 bg-zinc-900/60 px-2 py-1 text-zinc-300">
                    <span>{icon}</span>
                    <span>{r.label}</span>
                    {r.source && (
                      <span className="text-zinc-500">· {r.source}</span>
                    )}
                  </span>
                );
                return r.url ? (
                  <a
                    key={r.id}
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-80 transition-opacity"
                  >
                    {inner}
                  </a>
                ) : (
                  <span key={r.id}>{inner}</span>
                );
              })}
            </div>
          )}

          <div className="mt-3">
            <Link href={`/quiz/${topicId}`}>
              <Button variant="secondary" size="sm">
                Take Quiz
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Chat */}
      <div className="flex-1 max-w-4xl mx-auto w-full">
        <ChatPanel
          topicId={topicId}
          mode="LESSON"
          initialMessages={initialMessages}
        />
      </div>
    </div>
  );
}
