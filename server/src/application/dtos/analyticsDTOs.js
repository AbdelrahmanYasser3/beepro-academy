function toAnalyticsDTO(data) {
  return {
    course_id: data?.course_id || null,
    revenue: data?.revenue || 0,
    completion_rate: data?.completion_rate || 0,
    students: data?.students || 0,
    growth: data?.growth || 0,
    ratings: data?.ratings || 0,
  };
}

module.exports = { toAnalyticsDTO };
