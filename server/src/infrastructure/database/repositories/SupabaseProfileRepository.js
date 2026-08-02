const requireSupabase = require("./requireSupabase");

class SupabaseProfileRepository {
  constructor({ supabase }) {
    this.supabase = supabase;
  }

  async getById(userId) {
    requireSupabase(this.supabase);
    const { data, error } = await this.supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();
    if (error) throw error;
    return data;
  }

  async update(userId, payload) {
    requireSupabase(this.supabase);
    const { data, error } = await this.supabase
      .from("users")
      .update(payload)
      .eq("id", userId)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async updatePassword(userId, data, hashService) {
    requireSupabase(this.supabase);
    const { currentPassword, newPassword } = data;
    const { data: user, error: userError } = await this.supabase
      .from("users")
      .select("password_hash")
      .eq("id", userId)
      .single();
    if (userError) throw userError;

    const match = await hashService.compare(
      currentPassword,
      user.password_hash,
    );
    if (!match) throw new Error("Current password is incorrect");

    const newHash = await hashService.hash(newPassword);
    const { error } = await this.supabase
      .from("users")
      .update({ password_hash: newHash })
      .eq("id", userId);
    if (error) throw error;
    return { success: true };
  }
}

module.exports = SupabaseProfileRepository;
