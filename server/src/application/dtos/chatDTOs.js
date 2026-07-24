function toMessageDTO(message) {
  if (!message) return null;

  return {
    id: message.id,
    sender_id: message.sender_id,
    receiver_id: message.receiver_id,
    course_id: message.course_id,
    content: message.content,
    status: message.status || "sent",
    created_at: message.created_at,
    updated_at: message.updated_at,
  };
}

function toChatListDTO(result) {
  if (!result)
    return { items: [], pagination: { total: 0, limit: 20, offset: 0 } };

  return {
    items: (result.items || []).map(toMessageDTO),
    pagination: result.pagination || { total: 0, limit: 20, offset: 0 },
  };
}

module.exports = { toMessageDTO, toChatListDTO };
