import { NextResponse } from "next/server";
import { getTopic } from "@/lib/curriculum/queries";
import { getNextTopic } from "@/lib/curriculum/progression";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ topicId: string }> }
) {
  const { topicId: topicIdStr } = await params;
  const topicId = parseInt(topicIdStr, 10);
  const topic = await getTopic(topicId);
  if (!topic) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const nextTopic = await getNextTopic(topicId);

  return NextResponse.json({
    topic: {
      id: topic.id,
      title: topic.title,
      content: topic.content,
      type: topic.type,
      week: {
        weekNum: topic.week.weekNum,
        title: topic.week.title,
        month: { id: topic.week.month.id, title: topic.week.month.title },
      },
    },
    nextTopicId: nextTopic?.id ?? null,
  });
}
