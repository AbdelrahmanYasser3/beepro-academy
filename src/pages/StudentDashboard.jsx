import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiAward,
  FiBookOpen,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiLoader,
  FiPlay,
  FiTarget,
  FiUser,
} from "react-icons/fi";
import DashboardCard from "../components/dashboard/DashboardCard";
import { enrollmentService, sectionService } from "../services/api";
import { useAuth } from "../contexts/AuthContext";

const courseFromEnrollment = (row) => row.course || row.Course || row.courses || row;

const StudentDashboard = () => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [progressRows, setProgressRows] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const enrollmentRows = await enrollmentService.getUserEnrollments();
      const courses = enrollmentRows.map(courseFromEnrollment).filter(Boolean);
      const [progressResults, sectionGroups] = await Promise.all([
        Promise.all(
          courses.map((course) => enrollmentService.getCourseProgress(course.id)),
        ),
        Promise.all(courses.map((course) => sectionService.getSectionsByCourse(course.id))),
      ]);

      setEnrollments(enrollmentRows || []);
      setProgressRows(progressResults.filter(Boolean));
      setLessons(
        sectionGroups
          .flat()
          .flatMap((section) => section.lessons || section.Lessons || []),
      );
    } catch (err) {
      setError(err?.message || "Failed to load student dashboard.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const model = useMemo(() => {
    const courses = enrollments.map(courseFromEnrollment).filter(Boolean);
    const withProgress = courses.map((course, index) => {
      const progress = progressRows[index] || {};
      const percent =
        Number(progress.progress || progress.percentage || progress.completion || course.progress || 0) || 0;
      return { ...course, progress: percent };
    });
    const completed = withProgress.filter((course) => course.progress >= 100);
    const continueLearning = withProgress.filter((course) => course.progress < 100);
    const completedLessons = lessons.filter(
      (lesson) => lesson.completed || lesson.is_completed,
    ).length;
    const overallProgress = withProgress.length
      ? Math.round(
          withProgress.reduce((sum, course) => sum + course.progress, 0) /
            withProgress.length,
        )
      : 0;

    return { courses: withProgress, completed, continueLearning, completedLessons, overallProgress };
  }, [enrollments, lessons, progressRows]);

  const stats = [
    ["Enrolled Courses", model.courses.length, FiBookOpen],
    ["Learning Progress", `${model.overallProgress}%`, FiTarget],
    ["Completed Lessons", model.completedLessons, FiCheckCircle],
    ["Completed Courses", model.completed.length, FiAward],
  ];

  const quickActions = [
    [
      "Continue Course",
      model.continueLearning[0]?.id ? `/courses/${model.continueLearning[0].id}/learn` : "/my-courses",
      FiPlay,
    ],
    ["Take Assessment", "/course-analytics", FiTarget],
    ["Browse Courses", "/courses", FiBookOpen],
  ];

  const displayName =
    user?.full_name || user?.name || user?.email?.split("@")[0] || "Student";

  return (
    <div className="min-h-screen bg-secondary-50 px-4 py-6 dark:bg-dark-bg sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-2xl bg-gradient-to-br from-primary-600 to-[#0f766e] p-6 text-white shadow-sm md:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm font-medium">
                <FiUser className="mr-2" /> Student dashboard
              </div>
              <h1 className="text-2xl font-bold md:text-3xl">
                Welcome back, {displayName}
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-white/80 md:text-base">
                Enrolled courses, learning progress, completed lessons, and course activity.
              </p>
            </div>
            <Link
              to="/courses"
              className="btn w-full bg-white/20 text-white hover:bg-white/30 sm:w-auto"
            >
              Browse courses
            </Link>
          </div>
        </div>

        {error && (
          <div className="rounded-xl bg-red-50 p-4 text-red-700">{error}</div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-16 text-secondary-500">
            <FiLoader className="mr-2 h-6 w-6 animate-spin" /> Loading student dashboard
          </div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {stats.map(([label, value, Icon]) => (
                <div key={label} className="card card-body flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xl font-semibold">{value}</div>
                    <div className="text-sm text-secondary-500">{label}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid gap-6 xl:grid-cols-3">
              <ProgressCard title="Learning Progress" value={model.overallProgress} />
              <CourseList
                title="Continue Learning"
                rows={model.continueLearning}
                empty="No courses in progress."
              />
              <CourseList title="Enrolled Courses" rows={model.courses} empty="No enrolled courses yet." />
            </div>

            <div className="grid gap-6 xl:grid-cols-3">
              <CourseList title="Completed Courses" rows={model.completed} empty="No completed courses yet." />
              <ComingSoon title="Assessments" icon={FiTarget} />
              <ComingSoon title="Certificates" icon={FiAward} />
            </div>

            <DashboardCard title="Quick Actions" subtitle="Student shortcuts">
              <div className="grid gap-3 md:grid-cols-3">
                {quickActions.map(([label, to, Icon]) => (
                  <Link
                    key={label}
                    to={to}
                    className="flex items-center justify-between rounded-xl border border-secondary-100 p-4 transition-colors hover:bg-secondary-50 dark:border-dark-border dark:hover:bg-dark-card"
                  >
                    <span className="font-semibold text-secondary-900 dark:text-white">
                      {label}
                    </span>
                    <div className="rounded-lg bg-primary-50 p-2 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
                      <Icon className="h-4 w-4" />
                    </div>
                  </Link>
                ))}
              </div>
            </DashboardCard>
          </>
        )}
      </div>
    </div>
  );
};

const ProgressCard = ({ title, value }) => (
  <DashboardCard title={title} subtitle="Computed from course progress">
    <div className="text-3xl font-semibold text-secondary-900 dark:text-white">
      {value}%
    </div>
    <div className="mt-4 h-3 rounded-full bg-secondary-100 dark:bg-dark-border">
      <div
        className="h-full rounded-full bg-primary-500"
        style={{ width: `${Math.max(0, Math.min(100, Number(value || 0)))}%` }}
      />
    </div>
  </DashboardCard>
);

const CourseList = ({ title, rows, empty }) => (
  <DashboardCard title={title} subtitle="Backend records">
    <div className="space-y-3">
      {rows.length === 0 ? (
        <div className="rounded-xl border border-dashed p-6 text-center text-secondary-500">
          {empty}
        </div>
      ) : (
        rows.slice(0, 5).map((course) => (
          <div
            key={course.id || course.title}
            className="rounded-xl border border-secondary-100 p-4 dark:border-dark-border"
          >
            <div className="font-semibold text-secondary-900 dark:text-white">
              {course.title || course.course_title || "Course"}
            </div>
            <div className="mt-3 h-2 rounded-full bg-secondary-100 dark:bg-dark-border">
              <div
                className="h-full rounded-full bg-primary-500"
                style={{ width: `${Number(course.progress || 0)}%` }}
              />
            </div>
            <div className="mt-2 text-sm text-secondary-500">
              {Number(course.progress || 0)}% complete
            </div>
          </div>
        ))
      )}
    </div>
  </DashboardCard>
);

const ComingSoon = ({ title, icon: Icon }) => (
  <DashboardCard title={title} subtitle="Backend endpoint missing">
    <div className="rounded-xl border border-dashed p-6 text-center text-secondary-500">
      <Icon className="mx-auto mb-3 h-6 w-6" />
      Coming Soon
    </div>
  </DashboardCard>
);

export default StudentDashboard;
