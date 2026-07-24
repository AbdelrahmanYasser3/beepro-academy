class SupabaseReportRepository {
  constructor({ supabase }) {
    this.supabase = supabase;
  }

  async list({ userId, search, limit = 20, offset = 0 } = {}) {
    if (!this.supabase) {
      return { items: [], pagination: { total: 0, limit, offset } };
    }

    let query = this.supabase.from("reports").select("*", { count: "exact" });
    if (userId) query = query.eq("user_id", userId);
    if (search)
      query = query.or(`title.ilike.%${search}%,type.ilike.%${search}%`);

    const { data, error, count } = await query
      .order("generated_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return {
      items: data || [],
      pagination: { total: count || 0, limit, offset },
    };
  }

  async getById(id, userId) {
    if (!this.supabase) return null;
    const { data, error } = await this.supabase
      .from("reports")
      .select("*")
      .eq("id", id)
      .eq("user_id", userId)
      .single();
    if (error) throw error;
    return data;
  }

  async exportReport(userId, payload) {
    if (!this.supabase)
      return {
        id: `mock-${Date.now()}`,
        ...payload,
        user_id: userId,
        status: "generated",
      };
    const { data, error } = await this.supabase
      .from("reports")
      .insert({ ...payload, user_id: userId, status: "generated" })
      .select()
      .single();
    if (error) throw error;
    return data;
  }
}

module.exports = SupabaseReportRepository;
