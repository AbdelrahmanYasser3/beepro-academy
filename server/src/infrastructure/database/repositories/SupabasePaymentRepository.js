const requireSupabase = require("./requireSupabase");

class SupabasePaymentRepository {
  constructor({ supabase }) {
    this.supabase = supabase;
  }

  async list({ userId, limit = 20, offset = 0 } = {}) {
    requireSupabase(this.supabase);

    let query = this.supabase.from("payments").select("*", { count: "exact" });
    if (userId) query = query.eq("user_id", userId);

    const { data, error, count } = await query
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return {
      items: data || [],
      pagination: { total: count || 0, limit, offset },
    };
  }

  async getById(id, userId) {
    requireSupabase(this.supabase);
    const { data, error } = await this.supabase
      .from("payments")
      .select("*")
      .eq("id", id)
      .eq("user_id", userId)
      .single();
    if (error) throw error;
    return data;
  }

  async getHistory(userId) {
    requireSupabase(this.supabase);
    const { data, error } = await this.supabase
      .from("payments")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return {
      items: data || [],
      pagination: { total: data?.length || 0, limit: 20, offset: 0 },
    };
  }

  async create(payload) {
    requireSupabase(this.supabase);
    const { data, error } = await this.supabase
      .from("payments")
      .insert(payload)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async update(id, userId, payload) {
    requireSupabase(this.supabase);
    const { data, error } = await this.supabase
      .from("payments")
      .update(payload)
      .eq("id", id)
      .eq("user_id", userId)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
}

module.exports = SupabasePaymentRepository;
