class SupabaseChatRepository {
  constructor({ supabase }) {
    this.supabase = supabase;
  }

  async list({ userId, search, limit = 20, offset = 0 } = {}) {
    if (!this.supabase) {
      return { items: [], pagination: { total: 0, limit, offset } };
    }

    let query = this.supabase.from("messages").select("*", { count: "exact" });
    if (userId)
      query = query.or(`sender_id.eq.${userId},receiver_id.eq.${userId}`);
    if (search) query = query.or(`content.ilike.%${search}%`);

    const { data, error, count } = await query
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return {
      items: data || [],
      pagination: { total: count || 0, limit, offset },
    };
  }

  async getById(id) {
    if (!this.supabase) return null;
    const { data, error } = await this.supabase
      .from("messages")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    return data;
  }

  async create(payload) {
    if (!this.supabase) return { id: `mock-${Date.now()}`, ...payload };
    const { data, error } = await this.supabase
      .from("messages")
      .insert(payload)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async update(id, userId, payload) {
    if (!this.supabase) return { id, ...payload };
    const { data, error } = await this.supabase
      .from("messages")
      .update(payload)
      .eq("id", id)
      .eq("sender_id", userId)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async delete(id, userId) {
    if (!this.supabase) return { success: true };
    const { error } = await this.supabase
      .from("messages")
      .delete()
      .eq("id", id)
      .eq("sender_id", userId);
    if (error) throw error;
    return { success: true };
  }
}

module.exports = SupabaseChatRepository;
