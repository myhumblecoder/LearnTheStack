import { getFullCurriculum } from "@/lib/curriculum/queries";
import { Card, CardTitle } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Badge } from "@/components/ui/Badge";

export async function MonthProgress() {
  const curriculum = await getFullCurriculum();

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-zinc-100">
        Month-by-Month Progress
      </h2>
      {curriculum.map((month) => {
        const topics = month.weeks.flatMap((w) => w.topics);
        const completed = topics.filter(
          (t) => t.progress?.status === "COMPLETED"
        ).length;
        const total = topics.length;

        return (
          <Card key={month.id}>
            <div className="flex items-center justify-between mb-3">
              <CardTitle className="text-base">
                Month {month.id}: {month.title}
              </CardTitle>
              <Badge variant={completed === total ? "success" : "muted"}>
                {completed}/{total}
              </Badge>
            </div>
            <ProgressBar
              value={completed}
              max={total}
              color={completed === total ? "bg-green-600" : "bg-blue-600"}
            />
            <div className="mt-3 grid grid-cols-1 gap-2">
              {month.weeks.map((week) => (
                <div key={week.id} className="text-xs text-zinc-500">
                  <span className="text-zinc-400">
                    Week {week.weekNum}: {week.title}
                  </span>
                  <span className="ml-2">
                    (
                    {
                      week.topics.filter(
                        (t) => t.progress?.status === "COMPLETED"
                      ).length
                    }
                    /{week.topics.length})
                  </span>
                </div>
              ))}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
