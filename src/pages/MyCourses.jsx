import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiBookOpen,
  FiChevronRight,
  FiClock,
  FiGrid,
  FiList,
  FiLoader,
  FiSearch,
  FiUser,
} from "react-icons/fi";
import DashboardCard from "../components/dashboard/DashboardCard";
import { courseService, enrollmentService } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { canAccessTeacherFeatures } from "../lib/roles";

const enrollmentCourse = (row) =>
  row.course || row.Course || row.courses || row;
const VIEW_KEY = "beepro:my-courses:view";

const readView = () => {
  if (typeof window === "undefined") return "grid";
  return window.localStorage.getItem(VIEW_KEY) === "list" ? "list" : "grid";
};

const MyCourses = () => {
  const { user } = useAuth();
  const [view, setView] = useState(readView);
  const [search, setSearch] = useState("");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const isTeacher = canAccessTeacherFeatures(user?.role);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(VIEW_KEY, view);
  }, [view]);

  const loadCourses = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const rows = isTeacher
        ? await courseService.getInstructorCourses(user?.id)
        : (await enrollmentService.getUserEnrollments()).map(enrollmentCourse);
      setCourses((Array.isArray(rows) ? rows : []).filter(Boolean));
    } catch (err) {
      setCourses([]);
      setError(err?.message || "Failed to load courses.");
    } finally {
      setLoading(false);
    }
  }, [isTeacher, user?.id]);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  const filteredCourses = useMemo(
    () =>
      courses.filter((course) =>
        (course.title || course.course_title || "")
          .toLowerCase()
          .includes(search.toLowerCase()),
      ),
    [courses, search],
  );

  const emptyTitle = isTeacher
    ? "No courses created yet."
    : "No enrolled courses yet.";
  const emptyBody = isTeacher
    ? "Create a course to see it here."
    : "Enroll in a course to start learning.";

  return (
    <div className="min-h-screen bg-secondary-50 px-4 py-6 dark:bg-dark-bg sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 p-6 text-white md:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-2xl font-bold md:text-3xl">My Courses</h1>
              <p className="mt-2 text-sm text-white/80 md:text-base">
                {isTeacher
                  ? "Manage courses you created."
                  : "Track progress and continue learning."}
              </p>
            </div>
            <button
              className="btn bg-white/20 text-white hover:bg-white/30"
              onClick={() => setView(view === "grid" ? "list" : "grid")}
            >
              {view === "grid" ? (
                <FiList className="mr-2" />
              ) : (
                <FiGrid className="mr-2" />
              )}
              {view === "grid" ? "List view" : "Grid view"}
            </button>
          </div>
        </div>

        <DashboardCard
          title="Your course library"
          subtitle="Backend course records"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3 rounded-xl border border-secondary-100 bg-secondary-50 px-3 py-3 dark:border-dark-border dark:bg-dark-card">
              <FiSearch className="text-secondary-500" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search courses"
                className="w-full bg-transparent text-sm outline-none"
              />
            </div>
            <div className="text-sm text-secondary-500">
              {filteredCourses.length} courses
            </div>
          </div>

          {error && (
            <div className="mt-4 rounded-xl bg-red-50 p-4 text-red-700">
              {error}
            </div>
          )}

          {loading ? (
            <div className="mt-6 flex items-center justify-center p-8 text-secondary-500">
              <FiLoader className="mr-2 h-5 w-5 animate-spin" /> Loading courses
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="mt-6 rounded-xl border border-dashed p-8 text-center text-secondary-500">
              <div className="font-semibold text-secondary-900 dark:text-white">
                {emptyTitle}
              </div>
              <div className="mt-2">
                {search ? "No matching courses found." : emptyBody}
              </div>
            </div>
          ) : (
            <div
              className={`mt-6 grid gap-4 ${view === "grid" ? "lg:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"}`}
            >
              {filteredCourses.map((course) => (
                <div
                  key={course.id || course.title}
                  className="rounded-2xl border border-secondary-100 bg-white p-5 shadow-sm dark:border-dark-border dark:bg-dark-card"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-semibold text-secondary-900 dark:text-white">
                        {course.title || course.course_title || "Course"}
                      </div>
                      <div className="mt-2 flex items-center gap-2 text-sm text-secondary-500">
                        <FiUser className="h-4 w-4" />
                        {course.instructor?.full_name ||
                          course.instructor_name ||
                          course.status ||
                          "Instructor"}
                      </div>
                    </div>
                    <div className="rounded-full bg-primary-50 px-3 py-1 text-sm font-medium text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
                      {Number(course.progress || 0)}%
                    </div>
                  </div>

                  <div className="mt-4 h-2 rounded-full bg-secondary-100 dark:bg-dark-border">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-primary-500 to-primary-700"
                      style={{ width: `${Number(course.progress || 0)}%` }}
                    />
                  </div>

                  <div className="mt-3 flex items-center justify-between text-sm text-secondary-500">
                    <span>{course.status || "active"}</span>
                    <span className="flex items-center gap-1">
                      <FiClock className="h-4 w-4" /> Continue
                    </span>
                  </div>

                  <Link
                    to={
                      course.id
                        ? `/courses/${course.id}${isTeacher ? "" : "/learn"}`
                        : "/courses"
                    }
                    className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary-600"
                  >
                    {isTeacher ? "Open" : "Continue"}{" "}
                    <FiChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </DashboardCard>
      </div>
    </div>
  );
};

export default MyCourses;
