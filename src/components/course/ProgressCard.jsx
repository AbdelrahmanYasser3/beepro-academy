const ProgressCard = ({ progress }) => {
  const percent = Math.round(
    Number(progress?.completion_percentage ?? progress?.progress ?? 0),
  );
  const completedLessons = Number(
    progress?.completed_lessons ?? progress?.completedLessons ?? 0,
  );
  const totalLessons = Number(
    progress?.total_lessons ?? progress?.totalLessons ?? 0,
  );
  const remaining = Math.max(totalLessons - completedLessons, 0);

  return (
    <div className="rounded-xl border border-secondary-200 dark:border-dark-border bg-white dark:bg-dark-card p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-secondary-900 dark:text-white">
          Course Progress
        </h3>
        <span className="text-sm font-semibold text-primary-600">
          {percent}%
        </span>
      </div>
      <div className="h-2 rounded-full bg-secondary-100 dark:bg-dark-border overflow-hidden">
        <div
          className="h-full rounded-full bg-primary-500"
          style={{ width: `${Math.min(percent, 100)}%` }}
        />
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 text-sm text-secondary-600 dark:text-secondary-300">
        <div className="rounded-lg bg-secondary-50 dark:bg-dark-border p-3">
          <p className="font-semibold text-secondary-900 dark:text-white">
            Completed Lessons
          </p>
          <p>{completedLessons}</p>
        </div>
        <div className="rounded-lg bg-secondary-50 dark:bg-dark-border p-3">
          <p className="font-semibold text-secondary-900 dark:text-white">
            Remaining Lessons
          </p>
          <p>{remaining}</p>
        </div>
      </div>
    </div>
  );
};

export default ProgressCard;
