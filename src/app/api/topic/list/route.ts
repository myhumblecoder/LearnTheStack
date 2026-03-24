import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const topics = await prisma.topic.findMany({
    orderBy: [
      { week: { month: { id: "asc" } } },
      { week: { weekNum: "asc" } },
      { sortOrder: "asc" },
    ],
    include: {
      week: { include: { month: true } },
    },
  });

  return NextResponse.json(
    topics.map((t) => ({
      id: t.id,
      title: t.title,
      monthId: t.week.month.id,
      weekNum: t.week.weekNum,
    }))
  );
}
