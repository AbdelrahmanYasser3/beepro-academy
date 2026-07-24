import { Link } from "react-router-dom";
import {
  FiBookOpen,
  FiUsers,
  FiDollarSign,
  FiPlay,
  FiTrendingUp,
  FiUserPlus,
  FiZap,
  FiPlus,
  FiBarChart2,
  FiCalendar,
  FiMessageCircle,
  FiBell,
  FiUser,
} from "react-icons/fi";
import DashboardCard from "../components/dashboard/DashboardCard";

const TeacherDashboard = () => {
  const stats = [
    {
      label: "Total Courses",
      value: "8",
      icon: FiBookOpen,
      color: "from-primary-500 to-primary-700",
    },
    {
      label: "Total Students",
      value: "324",
      icon: FiUsers,
      color: "from-emerald-500 to-emerald-600",
    },
    {
      label: "Total Revenue",
      value: "$12.4k",
      icon: FiDollarSign,
      color: "from-amber-500 to-orange-500",
    },
    {
      label: "Live sessions",
      value: "5",
      icon: FiPlay,
      color: "from-fuchsia-500 to-purple-600",
    },
  ];

  const sessions = [
    {
      title: "Live Q&A Session",
      time: "Today • 7:00 PM",
      attendees: "84 attendees",
    },
    {
      title: "Mentorship Workshop",
      time: "Tomorrow • 6:30 PM",
      attendees: "56 attendees",
    },
  ];

  const performance = [
    { title: "AI Product Strategy", students: "92", revenue: "$3,200" },
    {
      title: "Financial Markets Essentials",
      students: "74",
      revenue: "$2,640",
    },
  ];

  const enrollments = [
    { student: "Maya A.", course: "AI Product Strategy", date: "2h ago" },
    {
      student: "Omar T.",
      course: "Financial Markets Essentials",
      date: "4h ago",
    },
  ];

  const quickActions = [
    { label: "Create course", to: "/teacher/create-course", icon: FiPlus },
    { label: "Live session", to: "/teacher/live-session", icon: FiPlay },
    { label: "My Courses", to: "/my-courses", icon: FiBookOpen },
    { label: "Analytics", to: "/course-analytics", icon: FiBarChart2 },
    { label: "Messages", to: "/messages", icon: FiMessageCircle },
    { label: "Calendar", to: "/calendar", icon: FiCalendar },
  ];

  return (
    <div className="min-h-screen bg-secondary-50 px-4 py-6 dark:bg-dark-bg sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-2xl bg-gradient-to-br from-[#0f172a] to-[#1e293b] p-6 text-white shadow-sm md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm font-medium">
                <FiZap className="mr-2" /> Teacher overview
              </div>
              <h1 className="text-2xl font-bold md:text-3xl">
                Manage your teaching impact
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-white/80 md:text-base">
                Review student growth, upcoming sessions, and course performance
                from one place.
              </p>
            </div>
            <Link
              to="/teacher/create-course"
              className="btn w-full bg-white/20 text-white hover:bg-white/30 sm:w-auto"
            >
              Create course
              <FiPlus className="ml-2" />
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

        <div className="grid gap-6 xl:grid-cols-3">
          <div className="space-y-6 xl:col-span-2">
            <DashboardCard
              title="Upcoming Live Sessions"
              subtitle="Your next live classes"
            >
              <div className="space-y-3">
                {sessions.map((session) => (
                  <div
                    key={session.title}
                    className="flex flex-col gap-3 rounded-xl border border-secondary-100 bg-secondary-50 p-4 dark:border-dark-border dark:bg-dark-card sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <div className="font-semibold text-secondary-900 dark:text-white">
                        {session.title}
                      </div>
                      <div className="mt-1 text-sm text-secondary-500">
                        {session.time}
                      </div>
                    </div>
                    <span className="rounded-full bg-primary-50 px-3 py-1 text-sm font-medium text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
                      {session.attendees}
                    </span>
                  </div>
                ))}
              </div>
            </DashboardCard>

            <DashboardCard
              title="Course Performance"
              subtitle="Most engaged learning paths"
            >
              <div className="space-y-3">
                {performance.map((course) => (
                  <div
                    key={course.title}
                    className="rounded-xl border border-secondary-100 p-4 dark:border-dark-border"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="font-semibold text-secondary-900 dark:text-white">
                          {course.title}
                        </div>
                        <div className="mt-1 text-sm text-secondary-500">
                          {course.students} students
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm font-semibold text-secondary-900 dark:text-white">
                        <FiTrendingUp className="h-4 w-4 text-primary-500" />{" "}
                        {course.revenue}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </DashboardCard>
          </div>

          <div className="space-y-6">
            <DashboardCard
              title="Recent Enrollments"
              subtitle="New students joining your courses"
            >
              <div className="space-y-3">
                {enrollments.map((entry) => (
                  <div
                    key={entry.student}
                    className="flex items-center justify-between rounded-xl border border-secondary-100 p-4 dark:border-dark-border"
                  >
                    <div>
                      <div className="font-semibold text-secondary-900 dark:text-white">
                        {entry.student}
                      </div>
                      <div className="mt-1 text-sm text-secondary-500">
                        {entry.course}
                      </div>
                    </div>
                    <span className="text-sm text-secondary-500">
                      {entry.date}
                    </span>
                  </div>
                ))}
              </div>
            </DashboardCard>

            <DashboardCard title="Quick Actions" subtitle="Useful shortcuts">
              <div className="space-y-3">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
