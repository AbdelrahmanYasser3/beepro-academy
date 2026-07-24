import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  FiBookOpen,
  FiCalendar,
  FiClock,
  FiAward,
  FiCreditCard,
  FiBell,
  FiChevronRight,
  FiPlay,
  FiPlus,
  FiUser,
  FiMessageCircle,
} from "react-icons/fi";
import DashboardCard from "../components/dashboard/DashboardCard";

const StudentDashboard = () => {
  const { t } = useTranslation();

  const quickActions = [
    {
      label: "My Courses",
      to: "/my-courses",
      icon: FiBookOpen,
    },
    {
      label: "Notifications",
      to: "/notifications",
      icon: FiBell,
    },
    {
      label: "Messages",
      to: "/messages",
      icon: FiMessageCircle,
    },
    {
      label: "Calendar",
      to: "/calendar",
      icon: FiCalendar,
    },
    {
      label: "Payments",
      to: "/payments",
      icon: FiCreditCard,
    },
    {
      label: "Profile",
      to: "/profile",
      icon: FiUser,
    },
  ];

  const continueLearning = [
    {
      title: "Financial Markets Essentials",
      progress: "72%",
      meta: "Module 4 of 6",
    },
    {
      title: "Data Analysis with Python",
      progress: "48%",
      meta: "Lesson 9 of 18",
    },
  ];

  const courses = [
    { title: "AI Product Strategy", status: "In progress" },
    { title: "Advanced Excel", status: "Upcoming" },
  ];

  const meetings = [
    { title: "Live Q&A Session", time: "Today • 7:00 PM" },
    { title: "Mentorship Workshop", time: "Tomorrow • 6:30 PM" },
  ];

  const notifications = [
    {
      title: "New lesson published",
      detail: "New content added to Financial Markets Essentials",
    },
    {
      title: "Payment confirmation",
      detail: "Your latest invoice has been recorded",
    },
  ];

  const certificates = [
    { title: "Python Foundations", issued: "Issued Apr 2026" },
    { title: "Leadership Essentials", issued: "Issued Mar 2026" },
  ];

  const payments = [
    { title: "AI Product Strategy", amount: "$149", date: "Jun 12" },
    { title: "Excel Masterclass", amount: "$89", date: "May 27" },
  ];

  return (
    <div className="min-h-screen bg-secondary-50 px-4 py-6 dark:bg-dark-bg sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 p-6 text-white shadow-sm md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm font-medium">
                <FiUser className="mr-2" /> Student learning hub
              </div>
              <h1 className="text-2xl font-bold md:text-3xl">
                Welcome back, Developer
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-white/80 md:text-base">
                Continue your learning journey, review your progress, and stay
                on top of upcoming sessions.
              </p>
            </div>
            <Link
              to="/courses"
              className="btn w-full bg-white/20 text-white hover:bg-white/30 sm:w-auto"
            >
              Browse courses
              <FiChevronRight className="ml-2" />
            </Link>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Enrolled", value: "12", icon: FiBookOpen },
            { label: "In progress", value: "4", icon: FiClock },
            { label: "Upcoming meetings", value: "3", icon: FiCalendar },
            { label: "Certificates", value: "2", icon: FiAward },
          ].map((item) => (
            <div
              key={item.label}
              className="card card-body flex items-center gap-4"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 text-white">
                <item.icon className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xl font-semibold">{item.value}</div>
                <div className="text-sm text-secondary-500">{item.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          <div className="space-y-6 xl:col-span-2">
            <DashboardCard
              title="Continue Learning"
              subtitle="Pick up where you left off"
            >
              <div className="space-y-3">
                {continueLearning.map((item) => (
                  <div
                    key={item.title}
                    className="flex flex-col gap-3 rounded-xl border border-secondary-100 bg-secondary-50 p-4 dark:border-dark-border dark:bg-dark-card sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <div className="font-semibold text-secondary-900 dark:text-white">
                        {item.title}
                      </div>
                      <div className="mt-1 text-sm text-secondary-500">
                        {item.meta}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="rounded-full bg-primary-50 px-3 py-1 text-sm font-medium text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
                        {item.progress}
                      </span>
                      <button className="btn btn-secondary btn-sm">
                        Resume
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </DashboardCard>

            <DashboardCard
              title="My Courses"
              subtitle="Your active learning tracks"
            >
              <div className="grid gap-3 md:grid-cols-2">
                {courses.map((course) => (
                  <div
                    key={course.title}
                    className="rounded-xl border border-secondary-100 p-4 dark:border-dark-border"
                  >
                    <div className="font-semibold text-secondary-900 dark:text-white">
                      {course.title}
                    </div>
                    <div className="mt-2 text-sm text-secondary-500">
                      {course.status}
                    </div>
                  </div>
                ))}
              </div>
            </DashboardCard>
          </div>

          <div className="space-y-6">
            <DashboardCard
              title="Upcoming Meetings"
              subtitle="Scheduled live sessions"
            >
              <div className="space-y-3">
                {meetings.map((meeting) => (
                  <div
                    key={meeting.title}
                    className="rounded-xl border border-secondary-100 p-4 dark:border-dark-border"
                  >
                    <div className="font-semibold text-secondary-900 dark:text-white">
                      {meeting.title}
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-sm text-secondary-500">
                      <FiCalendar className="h-4 w-4" /> {meeting.time}
                    </div>
                  </div>
                ))}
              </div>
            </DashboardCard>

            <DashboardCard
              title="Recent Notifications"
              subtitle="Latest platform updates"
            >
              <div className="space-y-3">
                {notifications.map((item) => (
                  <div
                    key={item.title}
                    className="flex items-start gap-3 rounded-xl border border-secondary-100 p-3 dark:border-dark-border"
                  >
                    <div className="mt-1 rounded-full bg-primary-50 p-2 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
                      <FiBell className="h-4 w-4" />
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

        <div className="grid gap-6 xl:grid-cols-2">
          <DashboardCard title="Certificates" subtitle="Completed achievements">
            <div className="space-y-3">
              {certificates.map((item) => (
                <div
                  key={item.title}
                  className="flex items-center justify-between rounded-xl border border-secondary-100 p-4 dark:border-dark-border"
                >
                  <div>
                    <div className="font-semibold text-secondary-900 dark:text-white">
                      {item.title}
                    </div>
                    <div className="mt-1 text-sm text-secondary-500">
                      {item.issued}
                    </div>
                  </div>
                  <FiAward className="h-5 w-5 text-primary-500" />
                </div>
              ))}
            </div>
          </DashboardCard>

          <DashboardCard
            title="Recent Payments"
            subtitle="Latest purchases and invoices"
          >
            <div className="space-y-3">
              {payments.map((item) => (
                <div
                  key={item.title}
                  className="flex items-center justify-between rounded-xl border border-secondary-100 p-4 dark:border-dark-border"
                >
                  <div>
                    <div className="font-semibold text-secondary-900 dark:text-white">
                      {item.title}
                    </div>
                    <div className="mt-1 text-sm text-secondary-500">
                      {item.date}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-secondary-900 dark:text-white">
                    <FiCreditCard className="h-4 w-4 text-primary-500" />{" "}
                    {item.amount}
                  </div>
                </div>
              ))}
            </div>
          </DashboardCard>
        </div>

        <DashboardCard
          title="Quick Actions"
          subtitle="Shortcuts to common tasks"
        >
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {quickActions.map((action) => (
              <Link
                key={action.label}
                to={action.to}
                className="rounded-xl border border-secondary-100 p-4 transition-colors hover:bg-secondary-50 dark:border-dark-border dark:hover:bg-dark-card"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-primary-50 p-2 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
                    <action.icon className="h-4 w-4" />
                  </div>
                  <span className="font-semibold text-secondary-900 dark:text-white">
                    {action.label}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </DashboardCard>
      </div>
    </div>
  );
};

export default StudentDashboard;
