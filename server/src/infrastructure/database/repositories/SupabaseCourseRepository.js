const requireSupabase = require("./requireSupabase");

class SupabaseCourseRepository {
  constructor({ supabase }) {
    this.supabase = supabase;
  }

  async list({ category, level, search, instructorId, limit = 20, offset = 0 } = {}) {
    requireSupabase(this.supabase);

    let q = this.supabase.from("courses").select("*", { count: "exact" });
    if (category) q = q.eq("category", category);
    if (level) q = q.eq("level", level);
    if (instructorId) q = q.eq("instructor_id", instructorId);
    if (search)
      q = q.or(`title.ilike.%${search}%,description.ilike.%${search}%`);

    const { data, error, count } = await q
      .range(offset, offset + limit - 1)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return { data: data || [], count: count || 0 };
  }

  async getById(id) {
    requireSupabase(this.supabase);
    const { data, error } = await this.supabase
      .from("courses")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    return data;
  }
  async create(payload) {
    requireSupabase(this.supabase);
    const { data, error } = await this.supabase
      .from("courses")
      .insert(payload)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async update(id, payload) {
    requireSupabase(this.supabase);
    const { data, error } = await this.supabase
      .from("courses")
      .update(payload)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async delete(id) {
    requireSupabase(this.supabase);
    const { error } = await this.supabase.from("courses").delete().eq("id", id);
    if (error) throw error;
    return { success: true };
  }
}

module.exports = SupabaseCourseRepository;
