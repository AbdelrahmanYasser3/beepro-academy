export const CATEGORY_META = {
  financial_markets: {
    id: "financial_markets",
    name: "Financial Markets",
    nameEn: "Financial Markets",
    icon: "",
  },
  data_analysis: {
    id: "data_analysis",
    name: "Data Analysis",
    nameEn: "Data Analysis",
    icon: "",
  },
  it: {
    id: "it",
    name: "IT",
    nameEn: "IT",
    icon: "",
  },
};

export const getCategoryMeta = (category) => {
  const id = category || "uncategorized";
  return (
    CATEGORY_META[id] || {
      id,
      name: id,
      nameEn: id,
      icon: "",
    }
  );
};

export const formatCourseForCard = (course = {}) => ({
  ...course,
  id: course.id,
  title: course.title || "Untitled course",
  titleEn: course.title_en || course.title || "Untitled course",
  description: course.description || "",
  descriptionEn: course.description_en || course.description || "",
  thumbnail:
    course.thumbnail_url ||
    course.image_url ||
    course.image ||
    "/assets/hero-background.png",
  price: Number(course.price || 0),
  category: course.category || "",
  level: course.level || "beginner",
  rating: Number(course.rating || 0),
  students: Number(course.students || course.students_count || 0),
  lessons: Number(course.lessons_count || course.lessonsCount || 0),
  duration: Number(course.duration || 0),
  instructor: {
    name:
      course.instructor?.full_name ||
      course.instructor_name ||
      course.instructor?.name ||
      "Instructor",
    nameEn:
      course.instructor?.full_name ||
      course.instructor_name ||
      course.instructor?.name ||
      "Instructor",
    avatar:
      course.instructor?.avatar_url ||
      course.instructor_avatar ||
      "/assets/abdullah1.jpg",
    bio: course.instructor?.bio || course.instructor_bio || "",
  },
  instructorAvatar:
    course.instructor?.avatar_url ||
    course.instructor_avatar ||
    "/assets/abdullah1.jpg",
  tags: course.tags || [],
  createdAt: course.created_at,
});

export const isCoursePublishedAndApproved = (course = {}) =>
  course?.status === "published" &&
  course?.admin_approval_status === "approved";

export const listFromApiResult = (result) => {
  if (Array.isArray(result)) return result;
  return result?.items || result?.data || [];
};
