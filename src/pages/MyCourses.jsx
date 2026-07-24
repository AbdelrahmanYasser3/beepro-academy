import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiBookOpen,
  FiSearch,
  FiGrid,
  FiList,
  FiClock,
  FiUser,
  FiChevronRight,
} from "react-icons/fi";
import DashboardCard from "../components/dashboard/DashboardCard";

const courseData = [
  {
    title: "Financial Markets Essentials",
    instructor: "Amina Hassan",
    progress: 72,
    lessons: "18/24 lessons",
    next: "Continue lesson 5",
  },
  {
    title: "Data Analysis with Python",
    instructor: "Omar Nabil",
    progress: 48,
    lessons: "10/21 lessons",
    next: "Continue lesson 9",
  },
  {
    title: "AI Product Strategy",
    instructor: "Lina Khaled",
    progress: 91,
    lessons: "20/22 lessons",
    next: "Continue lesson 20",
  },
];

const MyCourses = () => {
  const [view, setView] = useState("grid");
  const [search, setSearch] = useState("");

  const filteredCourses = courseData.filter((course) =>
    course.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-secondary-50 px-4 py-6 dark:bg-dark-bg sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 p-6 text-white md:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-2xl font-bold md:text-3xl">My Courses</h1>
              <p className="mt-2 text-sm text-white/80 md:text-base">
                Track progress, continue learning, and review your active course
                list.
              </p>
            </div>
            <div className="flex items-center gap-3">
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
        </div>

        <DashboardCard
          title="Your learning library"
          subtitle="Manage progress and pick up where you left off"
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

          <div
            className={`mt-6 grid gap-4 ${view === "grid" ? "lg:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"}`}
          >
            {filteredCourses.map((course) => (
              <div
                key={course.title}
                className="rounded-2xl border border-secondary-100 bg-white p-5 shadow-sm dark:border-dark-border dark:bg-dark-card"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-semibold text-secondary-900 dark:text-white">
                      {course.title}
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-sm text-secondary-500">
                      <FiUser className="h-4 w-4" /> {course.instructor}
                    </div>
                  </div>
                  <div className="rounded-full bg-primary-50 px-3 py-1 text-sm font-medium text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
                    {course.progress}%
                  </div>
                </div>

                <div className="mt-4 h-2 rounded-full bg-secondary-100 dark:bg-dark-border">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-primary-500 to-primary-700"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>

                <div className="mt-3 flex items-center justify-between text-sm text-secondary-500">
                  <span>{course.lessons}</span>
                  <span className="flex items-center gap-1">
                    <FiClock className="h-4 w-4" /> {course.next}
                  </span>
                </div>

                <Link
                  to="/courses"
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary-600"
                >
                  Continue <FiChevronRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </DashboardCard>
      </div>
    </div>
  );
};

export default MyCourses;
