import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { assessmentService } from "../../services/assessmentService";
import {
  courseService,
  enrollmentService,
  lessonService,
  reviewService,
} from "../../services/api";
import Button from "../ui/Button";
import {
  FiArrowLeft,
  FiArrowRight,
  FiCheckCircle,
  FiClock,
} from "react-icons/fi";

const LessonDetails = () => {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);
  const [error, setError] = useState("");
  const [assessments, setAssessments] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const [
          courseData,
          courseLessons,
          assessmentData,
          reviewData,
          progressData,
        ] = await Promise.all([
          courseService.getCourseById(courseId),
          lessonService.getLessonsByCourse(courseId),
          courseId
            ? assessmentService.getCourseAssessments(courseId)
            : Promise.resolve([]),
          courseId
            ? reviewService.getReviewsByCourse(courseId)
            : Promise.resolve([]),
          courseId
            ? enrollmentService.getCourseProgress(courseId)
            : Promise.resolve(null),
        ]);
        setCourse(courseData);
        const normalizedLessons = Array.isArray(courseLessons)
          ? courseLessons
          : [];
        setLessons(normalizedLessons);
        const currentLesson = normalizedLessons.find(
          (item) => String(item.id) === String(lessonId),
        );
        setLesson(currentLesson || null);
        setAssessments(Array.isArray(assessmentData) ? assessmentData : []);
        setReviews(Array.isArray(reviewData) ? reviewData : []);
        setProgress(
          progressData &&
            typeof progressData === "object" &&
            !Array.isArray(progressData)
            ? progressData
            : null,
        );
      } catch (err) {
        setError(err.message || "Failed to load lesson details.");
      } finally {
        setLoading(false);
      }
    };

    if (courseId) load();
  }, [courseId, lessonId]);

  const currentIndex = useMemo(
    () => lessons.findIndex((item) => String(item.id) === String(lessonId)),
    [lessons, lessonId],
  );
  const previousLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null;
  const nextLesson =
    currentIndex >= 0 && currentIndex < lessons.length - 1
      ? lessons[currentIndex + 1]
      : null;

  const handleMarkComplete = async () => {
    if (!lesson?.id) return;
    setMarking(true);
    try {
      await enrollmentService.updateProgress(lesson.id, {
        is_completed: true,
        watch_time_seconds: 60,
        completion_percentage: 100,
      });
      setLesson((prev) => ({ ...prev, completed: true }));
      setProgress((prev) => ({ ...prev, completion_percentage: 100 }));
    } catch (err) {
      setError(err.message || "Failed to mark lesson complete.");
    } finally {
      setMarking(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-3">Lesson not found</h2>
          <Button onClick={() => navigate(`/courses/${courseId}/learn`)}>
            Back to course
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 bg-secondary-50 dark:bg-dark-bg">
      <div className="container-custom grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
        <div className="rounded-2xl border border-secondary-200 dark:border-dark-border bg-white dark:bg-dark-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-primary-600 font-semibold">
                {course?.title || "Course"}
              </p>
              <h1 className="text-2xl font-bold mt-1">{lesson.title}</h1>
            </div>
            <Button
              onClick={() => navigate(`/courses/${courseId}/learn`)}
              variant="secondary"
            >
              Back
            </Button>
          </div>

          <div className="rounded-xl bg-secondary-100 dark:bg-dark-border aspect-video flex items-center justify-center mb-6">
            {lesson.contentUrl || lesson.content_url || lesson.video_url ? (
              <div className="text-center px-6">
                <p className="text-secondary-600 dark:text-secondary-300">
                  {String(
                    lesson.contentType || lesson.content_type || "video",
                  ).toUpperCase()}{" "}
                  content
                </p>
                <a
                  href={
                    lesson.contentUrl || lesson.content_url || lesson.video_url
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex items-center text-primary-600"
                >
                  Open content
                </a>
              </div>
            ) : (
              <div className="text-center px-6">
                <p className="text-secondary-600">No media linked yet.</p>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 text-sm text-secondary-600 dark:text-secondary-300 mb-4">
            <span className="inline-flex items-center gap-1">
              <FiClock className="w-4 h-4" />
              {lesson.duration || 0} min
            </span>
            <span
              className={`rounded-full px-2 py-1 text-xs ${lesson.isFree ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}
            >
              {lesson.isFree ? "Free" : "Paid"}
            </span>
          </div>

          <p className="text-secondary-700 dark:text-secondary-300 leading-relaxed">
            {lesson.description || "No description provided for this lesson."}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button
              onClick={handleMarkComplete}
              loading={marking}
              icon={FiCheckCircle}
            >
              Mark Complete
            </Button>
            <span className="text-sm text-secondary-500">
              {lesson.completed ? "Completed" : "In progress"}
            </span>
          </div>
          {progress && (
            <div className="mt-6 rounded-xl border border-secondary-200 dark:border-dark-border bg-secondary-50 dark:bg-dark-border p-4">
              <p className="text-sm font-semibold text-secondary-900 dark:text-white">
                Student progress
              </p>
              <p className="text-sm text-secondary-600 dark:text-secondary-300 mt-1">
                Completion:{" "}
                {Number(
                  progress.completion_percentage ?? progress.progress ?? 0,
                )}
                %
              </p>
            </div>
          )}
          {assessments.length > 0 && (
            <div className="mt-6 rounded-xl border border-secondary-200 dark:border-dark-border bg-white dark:bg-dark-card p-4">
              <h3 className="font-semibold mb-3">Assessment</h3>
              {assessments.map((assessment) => (
                <div
                  key={assessment.id}
                  className="text-sm text-secondary-600 dark:text-secondary-300"
                >
                  <p className="font-medium text-secondary-900 dark:text-white">
                    {assessment.title}
                  </p>
                  <p>{assessment.description || "No description provided."}</p>
                </div>
              ))}
            </div>
          )}
          {reviews.length > 0 && (
            <div className="mt-6 rounded-xl border border-secondary-200 dark:border-dark-border bg-white dark:bg-dark-card p-4">
              <h3 className="font-semibold mb-3">Comments / Reviews</h3>
              {reviews.map((review, index) => (
                <div
                  key={review.id || index}
                  className="text-sm text-secondary-600 dark:text-secondary-300 mb-3 last:mb-0"
                >
                  <p className="font-medium text-secondary-900 dark:text-white">
                    {review.user?.full_name || review.studentName || "Student"}
                  </p>
                  <p>
                    {review.comment || review.review || "No comment provided."}
                  </p>
                </div>
              ))}
            </div>
          )}
          {error && <p className="text-red-500 mt-3">{error}</p>}
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-secondary-200 dark:border-dark-border bg-white dark:bg-dark-card p-5">
            <h3 className="font-semibold mb-3">Resources</h3>
            <div className="space-y-2 text-sm text-primary-600">
              {lesson.contentUrl || lesson.content_url || lesson.video_url ? (
                <a
                  href={
                    lesson.contentUrl || lesson.content_url || lesson.video_url
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="block"
                >
                  Open linked resource
                </a>
              ) : (
                <p className="text-secondary-500">No resources available.</p>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-secondary-200 dark:border-dark-border bg-white dark:bg-dark-card p-5">
            <h3 className="font-semibold mb-3">Navigation</h3>
            <div className="flex flex-wrap gap-3">
              {previousLesson ? (
                <Button
                  onClick={() =>
                    navigate(
                      `/courses/${courseId}/lessons/${previousLesson.id}`,
                    )
                  }
                  variant="secondary"
                  icon={FiArrowLeft}
                >
                  Previous
                </Button>
              ) : (
                <span className="text-sm text-secondary-500">
                  No previous lesson
                </span>
              )}
              {nextLesson ? (
                <Button
                  onClick={() =>
                    navigate(`/courses/${courseId}/lessons/${nextLesson.id}`)
                  }
                  icon={FiArrowRight}
                >
                  Next
                </Button>
              ) : (
                <span className="text-sm text-secondary-500">
                  No next lesson
                </span>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-secondary-200 dark:border-dark-border bg-white dark:bg-dark-card p-5">
            <h3 className="font-semibold mb-3">Student info</h3>
            <p className="text-sm text-secondary-500">
              Signed in as {user?.full_name || user?.email || "student"}.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonDetails;
