class SupabaseSettingsRepository {
  constructor({ supabase }) {
    this.supabase = supabase;
  }

  async getByUserId(userId) {
    if (!this.supabase)
      return {
        id: `mock-${userId}`,
        user_id: userId,
        notifications_enabled: true,
        email_notifications: true,
        dark_mode: false,
      };
    const { data, error } = await this.supabase
      .from("settings")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();
    if (error) throw error;
    return data;
  }

  async update(userId, payload) {
    if (!this.supabase)
      return { id: `mock-${userId}`, user_id: userId, ...payload };
    const { data, error } = await this.supabase
      .from("settings")
      .upsert({ user_id: userId, ...payload })
      .select()
      .single();
    if (error) throw error;
    return data;
  }
}

module.exports = SupabaseSettingsRepository;
