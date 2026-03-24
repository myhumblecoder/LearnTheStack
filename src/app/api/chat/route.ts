import { streamTutorResponse } from "@/lib/ai/tutor";
import { getTopic } from "@/lib/curriculum/queries";
import { saveChatMessage } from "@/lib/curriculum/queries";
import { prisma } from "@/lib/db";
import { convertToModelMessages, type UIMessage } from "ai";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages, topicId, mode, prefetch } = body as {
      messages: UIMessage[];
      topicId: number | null;
      mode: "LESSON" | "QUIZ" | "CODE_REVIEW";
      prefetch?: boolean;
    };

    if (prefetch) {
      return new Response("OK");
    }

    if (!messages || !Array.isArray(messages)) {
      return new Response("Invalid messages", { status: 400 });
    }

    let topicContext = {
      monthNum: 1,
      monthTitle: "General",
      weekNum: 1,
      weekTitle: "General",
      topicTitle: "Code Review",
      topicContent: "General code review and feedback.",
      topicType: "BUILD",
      resources: [] as string[],
      completedTopics: [] as string[],
    };

    if (topicId) {
      const topic = await getTopic(topicId);
      if (!topic) {
        return new Response("Topic not found", { status: 404 });
      }

      const completedTopics = await prisma.topic.findMany({
        where: { progress: { status: "COMPLETED" } },
        select: { title: true },
        orderBy: [
          { week: { month: { id: "asc" } } },
          { week: { weekNum: "asc" } },
          { sortOrder: "asc" },
        ],
      });

      topicContext = {
        monthNum: topic.week.month.id,
        monthTitle: topic.week.month.title,
        weekNum: topic.week.weekNum,
        weekTitle: topic.week.title,
        topicTitle: topic.title,
        topicContent: topic.content,
        topicType: topic.type,
        resources: topic.resources,
        completedTopics: completedTopics.map(
          (t: { title: string }) => t.title
        ),
      };
    }

    // Save user message
    const lastMsg = messages[messages.length - 1];
    if (lastMsg?.role === "user") {
      const textPart = lastMsg.parts?.find(
        (p: { type: string }) => p.type === "text"
      );
      if (textPart && "text" in textPart) {
        await saveChatMessage({
          topicId: topicId || null,
          mode,
          role: "user",
          content: textPart.text,
        });
      }
    }

    const modelMessages = await convertToModelMessages(messages);

    const result = streamTutorResponse({
      mode,
      messages: modelMessages,
      topicContext,
    });

    // Save assistant response after streaming (fire-and-forget)
    result.text.then(async (text: string) => {
      await saveChatMessage({
        topicId: topicId || null,
        mode,
        role: "assistant",
        content: text,
      });
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response(
      JSON.stringify({ error: String(error) }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
