import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FiBarChart2,
  FiCheckCircle,
  FiLoader,
  FiStar,
  FiTrendingUp,
  FiUsers,
} from "react-icons/fi";
import DashboardCard from "../components/dashboard/DashboardCard";
import { useAuth } from "../contexts/AuthContext";
import { canAccessTeacherFeatures } from "../lib/roles";
import {
  courseService,
  enrollmentService,
  reviewService,
} from "../services/api";

const asArray = (value) => (Array.isArray(value) ? value : []);

const pickCourseId = (row) =>
  row?.course_id || row?.courseId || row?.course?.id || row?.Course?.id || null;

const CourseAnalytics = () => {
  const { user } = useAuth();
  const isTeacher = canAccessTeacherFeatures(user?.role);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [reviews, setReviews] = useState([]);

  const loadAnalytics = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [courseRows, enrollmentRows, reviewRows] = await Promise.all([
        isTeacher
          ? courseService.getInstructorCourses(user?.id)
          : courseService.getCourses().then((result) => result.data || []),
        enrollmentService.getUserEnrollments(),
        reviewService.getReviewsByCourse(),
      ]);

      setCourses(asArray(courseRows));
      setEnrollments(asArray(enrollmentRows));
      setReviews(asArray(reviewRows));
    } catch (err) {
      setError(err?.message || "Failed to load analytics.");
      setCourses([]);
      setEnrollments([]);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, [isTeacher, user?.id]);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  const analytics = useMemo(() => {
    const courseList = asArray(courses);
    const enrollmentList = asArray(enrollments);
    const reviewList = asArray(reviews);

    const courseIds = new Set(
      courseList.map((course) => course?.id).filter(Boolean),
    );
    const linkedEnrollments = enrollmentList.filter((row) => {
      const courseId = pickCourseId(row);
      return courseIds.size === 0 || !courseId || courseIds.has(courseId);
    });
    const linkedReviews = reviewList.filter((row) => {
      const courseId = row?.course_id || row?.courseId || row?.course?.id;
      return !courseIds.size || !courseId || courseIds.has(courseId);
    });

    const progressValues = linkedEnrollments
      .map((row) =>
        Number(
          row?.progress ||
            row?.percentage ||
            row?.completion ||
            row?.completion_percentage ||
            0,
        ),
      )
      .filter((value) => Number.isFinite(value));

    const averageProgress = progressValues.length
      ? Math.round(
          progressValues.reduce((sum, value) => sum + value, 0) /
            progressValues.length,
        )
      : null;

    const ratingValues = linkedReviews
      .map((row) => Number(row?.rating || row?.score || 0))
      .filter((value) => value > 0);

    const averageRating = ratingValues.length
      ? (
          ratingValues.reduce((sum, value) => sum + value, 0) /
          ratingValues.length
        ).toFixed(1)
      : null;

    const completedCourses = linkedEnrollments.filter((row) => {
      const progress = Number(
        row?.progress ||
          row?.percentage ||
          row?.completion ||
          row?.completion_percentage ||
          0,
      );
      return progress >= 100;
    }).length;

    const metrics = [
      {
        label: isTeacher ? "Instructor courses" : "Enrolled courses",
        value: courseList.length,
        icon: FiUsers,
      },
      {
        label: "Tracked enrollments",
        value: linkedEnrollments.length,
        icon: FiTrendingUp,
      },
      {
        label: "Average rating",
        value: averageRating ? `${averageRating}/5` : null,
        icon: FiStar,
      },
      {
        label: "Completion rate",
        value: averageProgress !== null ? `${averageProgress}%` : null,
        icon: FiCheckCircle,
      },
    ].filter((item) => item.value !== null && item.value !== undefined);

    const topCourses = courseList
      .slice(0, 3)
      .map((course) => {
        const students = Number(
          course.students ||
            course.students_count ||
            course.enrollments_count ||
            0,
        );
        return {
          label: course.title || course.titleEn || "Course",
          value:
            students > 0
              ? `${students} students`
              : Number(course.price || 0) > 0
                ? `$${Number(course.price || 0)}`
                : null,
        };
      })
      .filter((item) => item.value !== null);

    return {
      metrics,
      averageProgress,
      completedCourses,
      topCourses,
    };
  }, [courses, enrollments, isTeacher, reviews]);

  const hasAnalytics =
    analytics.metrics.length > 0 || analytics.topCourses.length > 0;

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
                Backend-derived course and enrollment metrics.
              </p>
            </div>
            <button
              className="btn bg-white/20 text-white hover:bg-white/30"
              type="button"
            >
              Export report
            </button>
          </div>
        </div>

        {error && (
          <div className="rounded-xl bg-red-50 p-4 text-red-700">{error}</div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-16 text-secondary-500">
            <FiLoader className="mr-2 h-6 w-6 animate-spin" /> Loading analytics
          </div>
        ) : !hasAnalytics ? (
          <div className="rounded-2xl border border-dashed border-secondary-200 bg-white p-8 text-center text-secondary-600 dark:border-dark-border dark:bg-dark-card">
            No analytics available.
          </div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {analytics.metrics.map((item) => (
                <div
                  key={item.label}
                  className="card card-body flex items-center gap-4"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 text-white">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xl font-semibold">{item.value}</div>
                    <div className="text-sm text-secondary-500">
                      {item.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
              <DashboardCard
                title="Enrollment overview"
                subtitle="Computed from live enrollment rows"
              >
                <div className="space-y-4">
                  <div className="rounded-2xl border border-secondary-100 p-5 dark:border-dark-border">
                    <div className="flex items-center gap-3 text-secondary-900 dark:text-white">
                      <FiBarChart2 className="h-5 w-5 text-primary-600" />
                      <span className="font-semibold">Average progress</span>
                    </div>
                    <div className="mt-4 text-3xl font-bold text-secondary-900 dark:text-white">
                      {analytics.averageProgress !== null
                        ? `${analytics.averageProgress}%`
                        : "No progress data"}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-secondary-100 p-5 dark:border-dark-border">
                    <div className="flex items-center gap-3 text-secondary-900 dark:text-white">
                      <FiCheckCircle className="h-5 w-5 text-emerald-500" />
                      <span className="font-semibold">Completed courses</span>
                    </div>
                    <div className="mt-4 text-3xl font-bold text-secondary-900 dark:text-white">
                      {analytics.completedCourses}
                    </div>
                  </div>
                </div>
              </DashboardCard>

              <DashboardCard
                title="Top course signals"
                subtitle="Summaries from the current backend data"
              >
                <div className="space-y-3">
                  {analytics.topCourses.length > 0 ? (
                    analytics.topCourses.map((row) => (
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
                    ))
                  ) : (
                    <div className="rounded-xl border border-dashed border-secondary-200 p-6 text-center text-secondary-500 dark:border-dark-border">
                      No analytics available.
                    </div>
                  )}
                </div>
              </DashboardCard>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CourseAnalytics;
