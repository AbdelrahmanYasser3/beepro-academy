const { AppError } = require("../../../domain/errors/AppError");

function requireSupabase(supabase) {
  if (!supabase) {
    throw new AppError(
      "Supabase backend is not configured for this operation.",
      503,
      "BACKEND_UNAVAILABLE",
    );
  }
  return supabase;
}

module.exports = requireSupabase;
