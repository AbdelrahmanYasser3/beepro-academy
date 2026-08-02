const requireSupabase = require("./requireSupabase");

class SupabaseSettingsRepository {
  constructor({ supabase }) {
    this.supabase = supabase;
  }

  async getByUserId(userId) {
    requireSupabase(this.supabase);
    const { data, error } = await this.supabase
      .from("settings")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();
    if (error) throw error;
    return data;
  }

  async update(userId, payload) {
    requireSupabase(this.supabase);
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
