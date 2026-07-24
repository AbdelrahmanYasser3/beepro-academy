function toProfileDTO(profile) {
  if (!profile) return null;

  return {
    id: profile.id,
    full_name: profile.full_name ?? profile.fullName,
    email: profile.email,
    role: profile.role,
    avatar_url: profile.avatar_url ?? profile.avatarUrl ?? null,
    phone: profile.phone ?? null,
    bio: profile.bio ?? null,
    created_at: profile.created_at ?? profile.createdAt,
    updated_at: profile.updated_at ?? profile.updatedAt,
  };
}

module.exports = { toProfileDTO };
