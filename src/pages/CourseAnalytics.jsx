import {
  FiBarChart2,
  FiTrendingUp,
  FiUsers,
  FiDollarSign,
  FiStar,
  FiCheckCircle,
} from "react-icons/fi";
import DashboardCard from "../components/dashboard/DashboardCard";

const analyticsCards = [
  {
    label: "Student count",
    value: "324",
    icon: FiUsers,
    color: "from-primary-500 to-primary-700",
  },
  {
    label: "Revenue",
    value: "$12.4k",
    icon: FiDollarSign,
    color: "from-emerald-500 to-emerald-600",
  },
  {
    label: "Course rating",
    value: "4.8/5",
    icon: FiStar,
    color: "from-amber-500 to-orange-500",
  },
  {
    label: "Completion rate",
    value: "84%",
    icon: FiCheckCircle,
    color: "from-fuchsia-500 to-purple-600",
  },
];

const CourseAnalytics = () => {
  return (
    <div className="min-h-screen bg-secondary-50 px-4 py-6 dark:bg-dark-bg sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-2xl bg-gradient-to-br from-[#0f172a] to-[#1e293b] p-6 text-white md:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-2xl font-bold md:text-3xl">
                Course Analytics
              </h1>
              <p className="mt-2 text-sm text-white/80 md:text-base">
                Measure engagement, growth, and learner outcomes across your
                courses.
              </p>
            </div>
            <button className="btn bg-white/20 text-white hover:bg-white/30">
              Export report
            </button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {analyticsCards.map((item) => (
            <div
              key={item.label}
              className="card card-body flex items-center gap-4"
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${item.color} text-white`}
              >
                <item.icon className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xl font-semibold">{item.value}</div>
                <div className="text-sm text-secondary-500">{item.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <DashboardCard
            title="Enrollment trend"
            subtitle="Monthly student growth"
          >
            <div className="rounded-2xl border border-secondary-100 p-5 dark:border-dark-border">
              <div className="flex items-end gap-3">
                {[40, 56, 72, 65, 88, 104].map((height, index) => (
                  <div key={index} className="flex-1">
                    <div
                      className="rounded-t-xl bg-gradient-to-t from-primary-500 to-primary-300"
                      style={{ height: `${height}px` }}
                    />
                    <div className="mt-2 text-center text-xs text-secondary-500">
                      {["Jan", "Feb", "Mar", "Apr", "May", "Jun"][index]}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </DashboardCard>

          <DashboardCard
            title="Revenue overview"
            subtitle="Course-level performance"
          >
            <div className="space-y-3">
              {[
                { label: "AI Product Strategy", value: "$3,200" },
                { label: "Financial Markets Essentials", value: "$2,640" },
                { label: "Data Analysis with Python", value: "$1,860" },
              ].map((row) => (
                <div
                  key={row.label}
                  className="flex items-center justify-between rounded-xl border border-secondary-100 p-4 dark:border-dark-border"
                >
                  <span className="font-semibold text-secondary-900 dark:text-white">
                    {row.label}
                  </span>
                  <span className="text-sm font-semibold text-secondary-900 dark:text-white">
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          </DashboardCard>
        </div>
      </div>
    </div>
  );
};

export default CourseAnalytics;
