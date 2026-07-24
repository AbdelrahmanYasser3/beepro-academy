import { Link } from "react-router-dom";
import {
  FiUsers,
  FiBookOpen,
  FiDollarSign,
  FiShield,
  FiAlertTriangle,
  FiActivity,
  FiUserPlus,
  FiCreditCard,
  FiCheckCircle,
  FiBarChart2,
  FiSettings,
  FiBell,
} from "react-icons/fi";
import DashboardCard from "../components/dashboard/DashboardCard";

const AdminDashboard = () => {
  const stats = [
    {
      label: "Total Users",
      value: "1,892",
      icon: FiUsers,
      color: "from-primary-500 to-primary-700",
    },
    {
      label: "Total Teachers",
      value: "84",
      icon: FiShield,
      color: "from-emerald-500 to-emerald-600",
    },
    {
      label: "Total Students",
      value: "1,808",
      icon: FiBookOpen,
      color: "from-amber-500 to-orange-500",
    },
    {
      label: "Total Courses",
      value: "137",
      icon: FiBookOpen,
      color: "from-fuchsia-500 to-purple-600",
    },
  ];

  const registrations = [
    { name: "Sara M.", email: "sara@example.com", date: "10 min ago" },
    { name: "Khaled R.", email: "khaled@example.com", date: "38 min ago" },
  ];

  const payments = [
    { name: "Course purchase", amount: "$149", date: "Today" },
    { name: "Instructor payout", amount: "$540", date: "Yesterday" },
  ];

  const pendingTeachers = [
    { name: "Nora S.", role: "Pending review" },
    { name: "Ali K.", role: "Awaiting documents" },
  ];

  const reports = [
    { title: "Support escalation", detail: "3 unresolved issues" },
    { title: "Payment discrepancy", detail: "Needs review" },
  ];

  const quickActions = [
    { label: "Reports", to: "/reports", icon: FiBarChart2 },
    { label: "Payments", to: "/payments", icon: FiCreditCard },
    { label: "Notifications", to: "/notifications", icon: FiBell },
    { label: "Settings", to: "/settings", icon: FiSettings },
  ];

  return (
    <div className="min-h-screen bg-secondary-50 px-4 py-6 dark:bg-dark-bg sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-2xl bg-gradient-to-br from-[#000428] to-[#004e92] p-6 text-white shadow-sm md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm font-medium">
                <FiActivity className="mr-2" /> Platform administration
              </div>
              <h1 className="text-2xl font-bold md:text-3xl">
                Platform overview and operations
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-white/80 md:text-base">
                Monitor platform health, user activity, finance, and pending
                teacher approvals.
              </p>
            </div>
            <Link
              to="/admin/blogs"
              className="btn w-full bg-white/20 text-white hover:bg-white/30 sm:w-auto"
            >
              Manage content
              <FiBarChart2 className="ml-2" />
            </Link>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="card card-body flex items-center gap-4"
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${stat.color} text-white`}
              >
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xl font-semibold">{stat.value}</div>
                <div className="text-sm text-secondary-500">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <DashboardCard
            title="Revenue Overview"
            subtitle="Performance across the platform"
          >
            <div className="rounded-xl border border-secondary-100 p-4 dark:border-dark-border">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-emerald-50 p-2 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                  <FiDollarSign className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-2xl font-semibold">$48.3k</div>
                  <div className="text-sm text-secondary-500">
                    Monthly recurring revenue
                  </div>
                </div>
              </div>
            </div>
          </DashboardCard>

          <DashboardCard
            title="System Health"
            subtitle="Operational indicators"
          >
            <div className="grid gap-3 md:grid-cols-2">
              {[
                { label: "Uptime", value: "99.98%" },
                { label: "API status", value: "Healthy" },
                { label: "Queue", value: "Low" },
                { label: "Support backlog", value: "3" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-secondary-100 p-4 dark:border-dark-border"
                >
                  <div className="text-sm text-secondary-500">{item.label}</div>
                  <div className="mt-1 text-lg font-semibold text-secondary-900 dark:text-white">
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          </DashboardCard>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <DashboardCard
            title="Latest Registrations"
            subtitle="Newest accounts on the platform"
          >
            <div className="space-y-3">
              {registrations.map((entry) => (
                <div
                  key={entry.email}
                  className="flex items-center justify-between rounded-xl border border-secondary-100 p-4 dark:border-dark-border"
                >
                  <div>
                    <div className="font-semibold text-secondary-900 dark:text-white">
                      {entry.name}
                    </div>
                    <div className="mt-1 text-sm text-secondary-500">
                      {entry.email}
                    </div>
                  </div>
                  <span className="text-sm text-secondary-500">
                    {entry.date}
                  </span>
                </div>
              ))}
            </div>
          </DashboardCard>

          <DashboardCard
            title="Latest Payments"
            subtitle="Recent transaction activity"
          >
            <div className="space-y-3">
              {payments.map((entry) => (
                <div
                  key={entry.name}
                  className="flex items-center justify-between rounded-xl border border-secondary-100 p-4 dark:border-dark-border"
                >
                  <div>
                    <div className="font-semibold text-secondary-900 dark:text-white">
                      {entry.name}
                    </div>
                    <div className="mt-1 text-sm text-secondary-500">
                      {entry.date}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-secondary-900 dark:text-white">
                    <FiCreditCard className="h-4 w-4 text-primary-500" />{" "}
                    {entry.amount}
                  </div>
                </div>
              ))}
            </div>
          </DashboardCard>
        </div>

        <DashboardCard
          title="Quick Actions"
          subtitle="Jump to admin workspace pages"
        >
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {quickActions.map((action) => (
              <Link
                key={action.label}
                to={action.to}
                className="flex items-center justify-between rounded-xl border border-secondary-100 p-4 transition-colors hover:bg-secondary-50 dark:border-dark-border dark:hover:bg-dark-card"
              >
                <span className="font-semibold text-secondary-900 dark:text-white">
                  {action.label}
                </span>
                <div className="rounded-lg bg-primary-50 p-2 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
                  <action.icon className="h-4 w-4" />
                </div>
              </Link>
            ))}
          </div>
        </DashboardCard>

        <div className="grid gap-6 xl:grid-cols-2">
          <DashboardCard
            title="Pending Teachers"
            subtitle="Accounts awaiting approval"
          >
            <div className="space-y-3">
              {pendingTeachers.map((teacher) => (
                <div
                  key={teacher.name}
                  className="flex items-center justify-between rounded-xl border border-secondary-100 p-4 dark:border-dark-border"
                >
                  <div>
                    <div className="font-semibold text-secondary-900 dark:text-white">
                      {teacher.name}
                    </div>
                    <div className="mt-1 text-sm text-secondary-500">
                      {teacher.role}
                    </div>
                  </div>
                  <button className="btn btn-secondary btn-sm">Review</button>
                </div>
              ))}
            </div>
          </DashboardCard>

          <DashboardCard
            title="Recent Reports"
            subtitle="Escalations and issues"
          >
            <div className="space-y-3">
              {reports.map((report) => (
                <div
                  key={report.title}
                  className="flex items-start gap-3 rounded-xl border border-secondary-100 p-4 dark:border-dark-border"
                >
                  <div className="rounded-lg bg-amber-50 p-2 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                    <FiAlertTriangle className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-secondary-900 dark:text-white">
                      {report.title}
                    </div>
                    <div className="mt-1 text-sm text-secondary-500">
                      {report.detail}
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

export default AdminDashboard;
