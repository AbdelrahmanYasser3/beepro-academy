const STATUS_META = {
  draft: {
    label: "Draft",
    className:
      "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300",
  },
  pending: {
    label: "Pending Review",
    className:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  },
  pending_review: {
    label: "Pending Review",
    className:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  },
  published: {
    label: "Published",
    className:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  },
  rejected: {
    label: "Rejected",
    className: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  },
};

export const normalizeModerationStatus = (value) =>
  String(value || "")
    .trim()
    .toLowerCase();

export const getModerationStatusMeta = (value) => {
  const status = normalizeModerationStatus(value);
  return (
    STATUS_META[status] || {
      label: value ? String(value) : "Draft",
      className:
        "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300",
    }
  );
};

export const isVisibleCourseStatus = (value) => {
  const status = normalizeModerationStatus(value);
  return ["published", "active"].includes(status);
};

export const isPendingModerationStatus = (value) => {
  const status = normalizeModerationStatus(value);
  return ["pending", "pending_review", "draft"].includes(status);
};
