function toSettingsDTO(settings) {
  if (!settings) return null;

  return {
    id: settings.id,
    notifications_enabled: settings.notifications_enabled,
    email_notifications: settings.email_notifications,
    dark_mode: settings.dark_mode,
    updated_at: settings.updated_at,
  };
}

module.exports = { toSettingsDTO };
