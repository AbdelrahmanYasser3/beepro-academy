function toLessonDTO(lesson) {
  if (!lesson) return null;

  return {
    id: lesson.id,
    course_id: lesson.course_id,
    title: lesson.title,
    content: lesson.content,
    video_url: lesson.video_url,
    duration: lesson.duration,
    order_index: lesson.order_index,
    created_at: lesson.created_at,
    updated_at: lesson.updated_at,
  };
}

function toLessonListDTO(result) {
  if (!result)
    return { items: [], pagination: { total: 0, limit: 20, offset: 0 } };

  return {
    items: (result.items || result.data || []).map(toLessonDTO),
    pagination: result.pagination || { total: 0, limit: 20, offset: 0 },
  };
}

module.exports = { toLessonDTO, toLessonListDTO };
