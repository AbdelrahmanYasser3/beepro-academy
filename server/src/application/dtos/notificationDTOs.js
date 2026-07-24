function toNotificationDTO(notification) {
  if (!notification) return null;

  return {
    id: notification.id,
    user_id: notification.user_id,
    title: notification.title,
    message: notification.message,
    type: notification.type,
    is_read: notification.is_read,
    created_at: notification.created_at,
    updated_at: notification.updated_at,
  };
}

function toNotificationListDTO(result) {
  if (!result)
    return { items: [], pagination: { total: 0, limit: 20, offset: 0 } };

  return {
    items: (result.items || []).map(toNotificationDTO),
    pagination: result.pagination || { total: 0, limit: 20, offset: 0 },
  };
}

module.exports = { toNotificationDTO, toNotificationListDTO };
