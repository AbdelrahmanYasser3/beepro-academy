const requireSupabase = require("./requireSupabase");

class SupabaseBlogRepository {
  constructor({ supabase }) {
    this.supabase = supabase;
  }

  async listPublished() {
    requireSupabase(this.supabase);
    const { data, error } = await this.supabase
      .from("blog_posts")
      .select(
        `*, author:users!author_id(id, full_name, avatar_url), course:courses(id, title, thumbnail_url)`,
      )
      .eq("status", "published")
      .order("published_at", { ascending: false });
    if (error) throw error;
    return data || [];
  }

  async listAll() {
    requireSupabase(this.supabase);
    const { data, error } = await this.supabase
      .from("blog_posts")
      .select(
        `*, author:users!author_id(id, full_name, avatar_url), course:courses(id, title, thumbnail_url)`,
      )
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
  }

  async create(payload) {
    requireSupabase(this.supabase);
    const { data, error } = await this.supabase
      .from("blog_posts")
      .insert(payload)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async update(id, payload) {
    requireSupabase(this.supabase);
    const { data, error } = await this.supabase
      .from("blog_posts")
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
      .from("blog_posts")
      .delete()
      .eq("id", id);
    if (error) throw error;
    return { success: true };
  }
}

module.exports = SupabaseBlogRepository;
