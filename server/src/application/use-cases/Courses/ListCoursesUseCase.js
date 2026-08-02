class ListCoursesUseCase {
  constructor({ courseRepository }) {
    this.courseRepository = courseRepository;
  }

  async execute({ category, level, search, instructorId, limit, offset } = {}) {
    return await this.courseRepository.list({
      category,
      level,
      search,
      instructorId,
      limit,
      offset,
    });
  }
}

module.exports = ListCoursesUseCase;
