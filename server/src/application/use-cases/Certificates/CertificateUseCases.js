const { NotFoundError } = require("../../../domain/errors/AppError");

class ListCertificatesUseCase {
  constructor({ certificateRepository }) {
    this.certificateRepository = certificateRepository;
  }

  async execute({ userId, limit, offset }) {
    return await this.certificateRepository.list({ userId, limit, offset });
  }
}

class GetCertificateUseCase {
  constructor({ certificateRepository }) {
    this.certificateRepository = certificateRepository;
  }

  async execute({ id, userId }) {
    if (!id) throw new Error("id is required");
    const certificate = await this.certificateRepository.getById(id, userId);
    if (!certificate) throw new NotFoundError("Certificate");
    return certificate;
  }
}

class GenerateCertificateUseCase {
  constructor({ certificateRepository }) {
    this.certificateRepository = certificateRepository;
  }

  async execute({ userId, data }) {
    if (!data) throw new Error("data is required");
    return await this.certificateRepository.generate(userId, data);
  }
}

module.exports = {
  ListCertificatesUseCase,
  GetCertificateUseCase,
  GenerateCertificateUseCase,
};
