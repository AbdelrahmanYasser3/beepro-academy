import Button from "../ui/Button";
import { FiClock, FiEdit3, FiTrash2 } from "react-icons/fi";

const LessonCard = ({ lesson, onEdit, onDelete, isInstructor = false }) => {
  const contentType = lesson.contentType || lesson.content_type || "video";
  const duration = lesson.duration || 0;

  return (
    <div className="rounded-xl border border-secondary-200 dark:border-dark-border bg-white dark:bg-dark-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h5 className="font-semibold text-secondary-900 dark:text-white">
              {lesson.title}
            </h5>
            <span className="text-xs uppercase tracking-wide rounded-full bg-secondary-100 dark:bg-dark-border px-2 py-1 text-secondary-600 dark:text-secondary-300">
              {String(contentType).toUpperCase()}
            </span>
          </div>
          <div className="mt-2 flex items-center gap-3 text-sm text-secondary-500">
            <span className="inline-flex items-center gap-1">
              <FiClock className="w-4 h-4" />
              {duration} min
            </span>
            <span
              className={`rounded-full px-2 py-1 text-xs ${lesson.isFree ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}
            >
              {lesson.isFree ? "Free" : "Paid"}
            </span>
          </div>
        </div>
        {isInstructor && (
          <div className="flex items-center gap-2">
            <Button
              onClick={() => onEdit(lesson)}
              size="sm"
              variant="secondary"
            >
              <FiEdit3 className="me-2" /> Edit
            </Button>
            <Button onClick={() => onDelete(lesson)} size="sm" variant="danger">
              <FiTrash2 className="me-2" /> Delete
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonCard;
