import { FiCalendar, FiClock, FiChevronRight } from "react-icons/fi";
import DashboardCard from "../components/dashboard/DashboardCard";

const schedule = [
  { title: "Live workshop", time: "09:00 AM", date: "Today", type: "Workshop" },
  {
    title: "Mentor office hours",
    time: "01:30 PM",
    date: "Tomorrow",
    type: "Office hours",
  },
  { title: "Project review", time: "04:00 PM", date: "Friday", type: "Review" },
];

const Calendar = () => {
  return (
    <div className="min-h-screen bg-secondary-50 px-4 py-6 dark:bg-dark-bg sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 p-6 text-white md:p-8">
          <h1 className="text-2xl font-bold md:text-3xl">Calendar</h1>
          <p className="mt-2 text-sm text-white/80 md:text-base">
            Plan your classes, workshops, and deadlines in one place.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <DashboardCard
            title="This month"
            subtitle="Upcoming sessions and milestone dates"
          >
            <div className="rounded-2xl border border-secondary-100 p-5 dark:border-dark-border">
              <div className="grid gap-4 md:grid-cols-7">
                {Array.from({ length: 7 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-secondary-100 p-3 text-center dark:border-dark-border"
                  >
                    <div className="text-xs uppercase text-secondary-500">
                      Mon
                    </div>
                    <div className="mt-2 text-lg font-semibold">{idx + 4}</div>
                  </div>
                ))}
              </div>
            </div>
          </DashboardCard>

          <DashboardCard
            title="Upcoming events"
            subtitle="Your next commitments"
          >
            <div className="space-y-3">
              {schedule.map((item) => (
                <div
                  key={item.title}
                  className="flex items-start justify-between rounded-xl border border-secondary-100 p-4 dark:border-dark-border"
                >
                  <div>
                    <div className="font-semibold text-secondary-900 dark:text-white">
                      {item.title}
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-sm text-secondary-500">
                      <FiCalendar className="h-4 w-4" /> {item.date}
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-sm text-secondary-500">
                      <FiClock className="h-4 w-4" /> {item.time}
                    </div>
                  </div>
                  <div className="rounded-full bg-primary-50 px-3 py-1 text-sm font-medium text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
                    {item.type}
                  </div>
                </div>
              ))}
            </div>
          </DashboardCard>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
