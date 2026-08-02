const { NotFoundError, ValidationError } = require("../../../domain/errors/AppError");
const User = require("../../../domain/entities/User");

function toSafeUser(user) {
  if (!user) return null;
  return {
    id: user.id,
    full_name: user.full_name,
    email: user.email,
    role: user.role,
    avatar_url: user.avatar_url,
    phone: user.phone,
    is_suspended: user.is_suspended,
    created_at: user.created_at,
    updated_at: user.updated_at,
  };
}

class PrismaAdminUserRepository {
  constructor({ prisma }) {
    this.prisma = prisma;
  }

  async listUsers() {
    return this.prisma.$queryRaw`
      SELECT
        u.id,
        u.full_name,
        u.email,
        u.role,
        u.avatar_url,
        u.phone,
        u.is_suspended,
        u.created_at,
        u.updated_at,
        COALESCE(course_counts.total, 0)::int AS total_courses,
        COALESCE(enrollment_counts.total, 0)::int AS total_enrollments
      FROM public.users u
      LEFT JOIN (
        SELECT instructor_id, COUNT(*) AS total
        FROM public.courses
        GROUP BY instructor_id
      ) course_counts ON course_counts.instructor_id = u.id
      LEFT JOIN (
        SELECT user_id, COUNT(*) AS total
        FROM public.enrollments
        GROUP BY user_id
      ) enrollment_counts ON enrollment_counts.user_id = u.id
      ORDER BY u.created_at DESC
    `;
  }

  async getUserDetails(id) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundError("User");

    let courses = [];
    let enrollments = [];

    if (["instructor", "teacher"].includes(user.role)) {
      courses = await this.prisma.$queryRaw`
        SELECT
          c.id,
          c.title,
          CASE WHEN COALESCE(c.is_published, false) THEN 'published' ELSE 'draft' END AS status,
          COALESCE(enrollment_counts.total, 0)::int AS enrollments
        FROM public.courses c
        LEFT JOIN (
          SELECT course_id, COUNT(*) AS total
          FROM public.enrollments
          GROUP BY course_id
        ) enrollment_counts ON enrollment_counts.course_id = c.id
        WHERE c.instructor_id = ${id}::uuid
        ORDER BY c.created_at DESC
      `;
    }

    if (user.role === "student") {
      enrollments = await this.prisma.$queryRaw`
        SELECT
          e.id,
          c.title AS course_title,
          instructor.full_name AS instructor_name,
          COALESCE(e.progress, 0)::int AS progress
        FROM public.enrollments e
        JOIN public.courses c ON c.id = e.course_id
        LEFT JOIN public.users instructor ON instructor.id = c.instructor_id
        WHERE e.user_id = ${id}::uuid
        ORDER BY e.created_at DESC
      `;
    }

    return {
      success: true,
      user: toSafeUser(user),
      courses,
      enrollments,
    };
  }

  async updateRole(id, role) {
    const normalizedRole = (role || "").toString().trim().toLowerCase();
    if (!User.isValidRole(normalizedRole)) {
      throw new ValidationError("Invalid role");
    }

    const user = await this.prisma.user.update({
      where: { id },
      data: { role: normalizedRole },
    });
    return toSafeUser(user);
  }

  async setSuspended(id, isSuspended) {
    const user = await this.prisma.user.update({
      where: { id },
      data: { is_suspended: Boolean(isSuspended) },
    });
    return toSafeUser(user);
  }

  async deleteUser(id) {
    await this.prisma.user.delete({ where: { id } });
    return { success: true, id };
  }
}

module.exports = PrismaAdminUserRepository;
