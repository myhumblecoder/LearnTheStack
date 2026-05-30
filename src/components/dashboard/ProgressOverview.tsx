import { getProgressStats } from "@/lib/curriculum/queries";
import { getTodayPomodoroStats } from "@/actions/session";
import { Card, CardTitle } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";

export async function ProgressOverview() {
  const stats = await getProgressStats();
  const today = await getTodayPomodoroStats();
  const percent = Math.round((stats.completed / stats.total) * 100);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardTitle className="text-sm text-zinc-500 mb-2">
          Overall Progress
        </CardTitle>
        <div className="text-2xl font-bold text-zinc-100 mb-2">{percent}%</div>
        <ProgressBar value={stats.completed} max={stats.total} />
        <p className="text-xs text-zinc-500 mt-2">
          {stats.completed} of {stats.total} topics completed
        </p>
      </Card>

      <Card>
        <CardTitle className="text-sm text-zinc-500 mb-2">
          In Progress
        </CardTitle>
        <div className="text-2xl font-bold text-yellow-400">
          {stats.inProgress}
        </div>
        <p className="text-xs text-zinc-500 mt-2">
          topics currently active
        </p>
      </Card>

      <Card>
        <CardTitle className="text-sm text-zinc-500 mb-2">
          Today&apos;s Focus
        </CardTitle>
        <div className="text-2xl font-bold text-blue-400">
          {today.pomodoros} 🍅{" "}
          <span className="text-base font-normal text-zinc-500">
            · {today.minutes}m
          </span>
        </div>
        <p className="text-xs text-zinc-500 mt-2">
          {today.minutes >= 60 ? "Great session!" : "Keep going!"}
        </p>
      </Card>
    </div>
  );
}
