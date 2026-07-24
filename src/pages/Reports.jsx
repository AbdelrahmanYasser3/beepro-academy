import {
  FiFileText,
  FiPieChart,
  FiShield,
  FiAlertTriangle,
} from "react-icons/fi";
import DashboardCard from "../components/dashboard/DashboardCard";

const reportStats = [
  { label: "Weekly reports", value: "14" },
  { label: "Resolved tickets", value: "9" },
  { label: "Pending review", value: "3" },
];

const Reports = () => {
  return (
    <div className="min-h-screen bg-secondary-50 px-4 py-6 dark:bg-dark-bg sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 p-6 text-white md:p-8">
          <h1 className="text-2xl font-bold md:text-3xl">Reports</h1>
          <p className="mt-2 text-sm text-white/80 md:text-base">
            Access summary reports, compliance notes, and issue tracking.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {reportStats.map((stat) => (
            <div key={stat.label} className="card card-body">
              <div className="text-2xl font-semibold">{stat.value}</div>
              <div className="mt-1 text-sm text-secondary-500">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <DashboardCard
            title="Performance snapshot"
            subtitle="Most important indicators"
          >
            <div className="space-y-4">
              {[
                { label: "Engagement", value: "87%" },
                { label: "Retention", value: "76%" },
                { label: "Completion", value: "84%" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-secondary-100 p-4 dark:border-dark-border"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-semibold text-secondary-900 dark:text-white">
                      {item.label}
                    </span>
                    <span className="text-sm font-semibold text-primary-600">
                      {item.value}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary-100 dark:bg-dark-border">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-primary-500 to-primary-700"
                      style={{ width: item.value }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </DashboardCard>

          <DashboardCard
            title="Critical items"
            subtitle="Open concerns requiring attention"
          >
            <div className="space-y-3">
              {[
                {
                  title: "Access review",
                  detail: "Two accounts require permission cleanup",
                  icon: FiShield,
                },
                {
                  title: "Incident note",
                  detail: "One report needs escalation from support",
                  icon: FiAlertTriangle,
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="flex items-start gap-3 rounded-xl border border-secondary-100 p-4 dark:border-dark-border"
                >
                  <div className="rounded-full bg-primary-50 p-2 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
                    <item.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-secondary-900 dark:text-white">
                      {item.title}
                    </div>
                    <div className="mt-1 text-sm text-secondary-500">
                      {item.detail}
                    </div>
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

export default Reports;
