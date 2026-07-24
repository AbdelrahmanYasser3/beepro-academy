class DeleteEnrollmentUseCase {
  constructor({ enrollmentRepository }) {
    this.enrollmentRepository = enrollmentRepository;
  }

  async execute({ id, userId }) {
    if (!id || !userId) throw new Error("id and userId are required");
    return await this.enrollmentRepository.delete(id, userId);
  }
}

module.exports = DeleteEnrollmentUseCase;
