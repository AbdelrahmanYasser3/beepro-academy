const requireSupabase = require("./requireSupabase");

class SupabaseEnrollmentRepository {
  constructor({ supabase }) {
    this.supabase = supabase;
  }

  async enrollStudentIfEligible(courseId, userId) {
    requireSupabase(this.supabase);
    const { data, error } = await this.supabase.rpc(
      "enroll_student_if_eligible",
      { p_course_id: courseId },
    );
    if (error) throw error;
    return data;
  }

  async getUserEnrollments(userId) {
    requireSupabase(this.supabase);
    const { data, error } = await this.supabase
      .from("enrollments")
      .select(
        `*, course:courses(id, title, thumbnail_url, category, instructor:users!instructor_id(full_name), lessons(count))`,
      )
      .eq("user_id", userId)
      .order("enrolled_at", { ascending: false });
    if (error) throw error;
    return data || [];
  }

  async isEnrolled(userId, courseId) {
    requireSupabase(this.supabase);
    const { data, error } = await this.supabase
      .from("enrollments")
      .select("id")
      .eq("user_id", userId)
      .eq("course_id", courseId)
      .maybeSingle();
    if (error && error.code !== "PGRST116") throw error;
    return !!data;
  }

  async updateProgress(enrollmentId, progress) {
    requireSupabase(this.supabase);
    const { data, error } = await this.supabase
      .from("enrollments")
      .update({ progress })
      .eq("id", enrollmentId)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async delete(id, userId) {
    requireSupabase(this.supabase);
    const { error } = await this.supabase
      .from("enrollments")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);
    if (error) throw error;
    return { success: true };
  }
}

module.exports = SupabaseEnrollmentRepository;
