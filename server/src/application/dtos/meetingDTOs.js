function toMeetingDTO(meeting) {
  if (!meeting) return null;

  return {
    id: meeting.id,
    title: meeting.title,
    description: meeting.description,
    scheduled_at: meeting.scheduled_at,
    meeting_type: meeting.meeting_type,
    course_id: meeting.course_id,
    organizer_id: meeting.organizer_id,
    participant_ids: meeting.participant_ids || [],
    status: meeting.status || "scheduled",
    created_at: meeting.created_at,
    updated_at: meeting.updated_at,
  };
}

function toMeetingListDTO(result) {
  if (!result)
    return { items: [], pagination: { total: 0, limit: 20, offset: 0 } };

  return {
    items: (result.items || []).map(toMeetingDTO),
    pagination: result.pagination || { total: 0, limit: 20, offset: 0 },
  };
}

module.exports = { toMeetingDTO, toMeetingListDTO };
