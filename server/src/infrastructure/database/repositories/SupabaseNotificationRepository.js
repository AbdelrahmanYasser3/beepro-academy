const requireSupabase = require("./requireSupabase");

class SupabaseNotificationRepository {
  constructor({ supabase }) {
    this.supabase = supabase;
  }

  async list({ userId, limit = 20, offset = 0 } = {}) {
    requireSupabase(this.supabase);

    let query = this.supabase
      .from("notifications")
      .select("*", { count: "exact" });
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

  async markRead(id, userId) {
    requireSupabase(this.supabase);
    const { data, error } = await this.supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", id)
      .eq("user_id", userId)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async markAllRead(userId) {
    requireSupabase(this.supabase);
    const { error } = await this.supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", userId);
    if (error) throw error;
    return { success: true };
  }

  async delete(id, userId) {
    requireSupabase(this.supabase);
    const { error } = await this.supabase
      .from("notifications")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);
    if (error) throw error;
    return { success: true };
  }
}

module.exports = SupabaseNotificationRepository;
