class SupabaseAnalyticsRepository {
  constructor({ supabase }) {
    this.supabase = supabase;
  }

  async getCourseAnalytics(courseId) {
    if (!this.supabase) {
      return {
        revenue: 0,
        completion_rate: 0,
        students: 0,
        growth: 0,
        ratings: 0,
      };
    }

    const { data: enrollments, error: enrollError } = await this.supabase
      .from("enrollments")
      .select("progress")
      .eq("course_id", courseId);
    if (enrollError) throw enrollError;

    return {
      revenue: 0,
      completion_rate: enrollments?.length
        ? (
            (enrollments.filter((item) => Number(item.progress) >= 100).length /
              enrollments.length) *
            100
          ).toFixed(1)
        : 0,
      students: enrollments?.length || 0,
      growth: 0,
      ratings: 0,
    };
  }

  async getTeacherAnalytics(userId) {
    if (!this.supabase) {
      return {
        revenue: 0,
        completion_rate: 0,
        students: 0,
        growth: 0,
        ratings: 0,
      };
    }

    const { data: courses, error: courseError } = await this.supabase
      .from("courses")
      .select("id")
      .eq("instructor_id", userId);
    if (courseError) throw courseError;

    const { data: enrollments, error: enrollError } = await this.supabase
      .from("enrollments")
      .select("progress")
      .in(
        "course_id",
        (courses || []).map((course) => course.id),
      );
    if (enrollError) throw enrollError;

    return {
      revenue: 0,
      completion_rate: enrollments?.length
        ? (
            (enrollments.filter((item) => Number(item.progress) >= 100).length /
              enrollments.length) *
            100
          ).toFixed(1)
        : 0,
      students: enrollments?.length || 0,
      growth: 0,
      ratings: 0,
    };
  }

  async getAdminAnalytics() {
    if (!this.supabase) {
      return {
        revenue: 0,
        completion_rate: 0,
        students: 0,
        growth: 0,
        ratings: 0,
      };
    }

    const { data: enrollments, error } = await this.supabase
      .from("enrollments")
      .select("progress");
    if (error) throw error;

    return {
      revenue: 0,
      completion_rate: enrollments?.length
        ? (
            (enrollments.filter((item) => Number(item.progress) >= 100).length /
              enrollments.length) *
            100
          ).toFixed(1)
        : 0,
      students: enrollments?.length || 0,
      growth: 0,
      ratings: 0,
    };
  }
}

module.exports = SupabaseAnalyticsRepository;
