class SupabaseCertificateRepository {
  constructor({ supabase }) {
    this.supabase = supabase;
  }

  async list({ userId, limit = 20, offset = 0 } = {}) {
    if (!this.supabase) {
      return { items: [], pagination: { total: 0, limit, offset } };
    }

    let query = this.supabase
      .from("certificates")
      .select("*", { count: "exact" });
    if (userId) query = query.eq("user_id", userId);

    const { data, error, count } = await query
      .order("issued_at", { ascending: false })
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
      .from("certificates")
      .select("*")
      .eq("id", id)
      .eq("user_id", userId)
      .single();
    if (error) throw error;
    return data;
  }

  async generate(userId, payload) {
    if (!this.supabase)
      return {
        id: `mock-${Date.now()}`,
        user_id: userId,
        ...payload,
        status: "issued",
      };
    const { data, error } = await this.supabase
      .from("certificates")
      .insert({ ...payload, user_id: userId, status: "issued" })
      .select()
      .single();
    if (error) throw error;
    return data;
  }
}

module.exports = SupabaseCertificateRepository;
