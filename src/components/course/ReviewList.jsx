const ReviewList = ({ reviews = [] }) => {
  const average = reviews.length
    ? (
        reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) /
        reviews.length
      ).toFixed(1)
    : "0.0";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Student Reviews</h3>
        <div className="text-sm text-secondary-600 dark:text-secondary-300">
          <span className="font-semibold text-primary-600">{average}</span> / 5
          • {reviews.length} review{reviews.length === 1 ? "" : "s"}
        </div>
      </div>
      {reviews.length === 0 ? (
        <div className="rounded-xl border border-dashed border-secondary-300 p-6 text-center text-secondary-500">
          No reviews yet.
        </div>
      ) : (
        reviews.map((review, index) => (
          <div
            key={review.id || `${review.studentName || "review"}-${index}`}
            className="rounded-xl border border-secondary-200 dark:border-dark-border bg-white dark:bg-dark-card p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-semibold text-secondary-900 dark:text-white">
                  {review.studentName ||
                    review.user?.full_name ||
                    review.user?.fullName ||
                    "Student"}
                </p>
                <p className="text-sm text-secondary-500">
                  {review.createdAt || review.created_at || ""}
                </p>
              </div>
              <div className="text-sm font-semibold text-primary-600">
                {Number(review.rating || 0)}/5
              </div>
            </div>
            {review.comment && (
              <p className="mt-3 text-secondary-600 dark:text-secondary-300">
                {review.comment}
              </p>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default ReviewList;
