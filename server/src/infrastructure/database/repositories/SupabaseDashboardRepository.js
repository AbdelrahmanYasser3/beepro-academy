class SupabaseDashboardRepository {
  constructor({ supabase }) {
    this.supabase = supabase;
  }

  async getStudentDashboard(userId) {
    if (!this.supabase) {
      return {
        enrolled_courses: 0,
        completed_courses: 0,
        in_progress_courses: 0,
        next_lessons: [],
      };
    }

    const { data: enrollments, error } = await this.supabase
      .from("enrollments")
      .select("id, progress, course_id")
      .eq("user_id", userId);
    if (error) throw error;

    return {
      enrolled_courses: enrollments?.length || 0,
      completed_courses:
        enrollments?.filter((item) => Number(item.progress) >= 100).length || 0,
      in_progress_courses:
        enrollments?.filter((item) => Number(item.progress) < 100).length || 0,
      next_lessons: [],
    };
  }

  async getTeacherDashboard(userId) {
    if (!this.supabase) {
      return {
        courses_created: 0,
        students_enrolled: 0,
        avg_rating: 0,
        revenue: 0,
      };
    }

    const { data: courses, error: coursesError } = await this.supabase
      .from("courses")
      .select("id")
      .eq("instructor_id", userId);
    if (coursesError) throw coursesError;

    const { data: enrollments, error: enrollError } = await this.supabase
      .from("enrollments")
      .select("course_id")
      .in(
        "course_id",
        (courses || []).map((course) => course.id),
      );
    if (enrollError) throw enrollError;

    return {
      courses_created: courses?.length || 0,
      students_enrolled: enrollments?.length || 0,
      avg_rating: 0,
      revenue: 0,
    };
  }

  async getAdminDashboard() {
    if (!this.supabase) {
      return {
        total_users: 0,
        total_courses: 0,
        total_enrollments: 0,
        revenue: 0,
      };
    }

    const [{ count: users }, { count: courses }, { count: enrollments }] =
      await Promise.all([
        this.supabase.from("users").select("id", { count: "exact" }),
        this.supabase.from("courses").select("id", { count: "exact" }),
        this.supabase.from("enrollments").select("id", { count: "exact" }),
      ]);

    return {
      total_users: users || 0,
      total_courses: courses || 0,
      total_enrollments: enrollments || 0,
      revenue: 0,
    };
  }
}

module.exports = SupabaseDashboardRepository;
