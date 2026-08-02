const requireSupabase = require("./requireSupabase");

class SupabaseMeetingRepository {
  constructor({ supabase }) {
    this.supabase = supabase;
  }

  async list({
    userId,
    search,
    sortBy,
    sortOrder,
    limit = 20,
    offset = 0,
  } = {}) {
    requireSupabase(this.supabase);

    let query = this.supabase.from("meetings").select("*", { count: "exact" });
    if (userId)
      query = query.or(
        `organizer_id.eq.${userId},participant_ids.cs.{${userId}}`,
      );
    if (search)
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);

    const { data, error, count } = await query
      .order(sortBy || "scheduled_at", { ascending: sortOrder !== "desc" })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return {
      items: data || [],
      pagination: { total: count || 0, limit, offset },
    };
  }

  async getById(id) {
    requireSupabase(this.supabase);
    const { data, error } = await this.supabase
      .from("meetings")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    return data;
  }

  async create(payload) {
    requireSupabase(this.supabase);
    const { data, error } = await this.supabase
      .from("meetings")
      .insert(payload)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async update(id, payload) {
    requireSupabase(this.supabase);
    const { data, error } = await this.supabase
      .from("meetings")
      .update(payload)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async delete(id) {
    requireSupabase(this.supabase);
    const { error } = await this.supabase
      .from("meetings")
      .delete()
      .eq("id", id);
    if (error) throw error;
    return { success: true };
  }
}

module.exports = SupabaseMeetingRepository;
