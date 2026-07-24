const { NotFoundError } = require("../../../domain/errors/AppError");

class GetProfileUseCase {
  constructor({ profileRepository }) {
    this.profileRepository = profileRepository;
  }

  async execute({ userId }) {
    if (!userId) throw new Error("userId is required");
    const profile = await this.profileRepository.getById(userId);
    if (!profile) throw new NotFoundError("Profile");
    return profile;
  }
}

class UpdateProfileUseCase {
  constructor({ profileRepository }) {
    this.profileRepository = profileRepository;
  }

  async execute({ userId, data }) {
    if (!userId) throw new Error("userId is required");
    if (!data) throw new Error("data is required");
    return await this.profileRepository.update(userId, data);
  }
}

class UpdateAvatarUseCase {
  constructor({ profileRepository }) {
    this.profileRepository = profileRepository;
  }

  async execute({ userId, avatarUrl }) {
    if (!userId) throw new Error("userId is required");
    return await this.profileRepository.update(userId, {
      avatar_url: avatarUrl,
    });
  }
}

class UpdatePasswordUseCase {
  constructor({ profileRepository, hashService }) {
    this.profileRepository = profileRepository;
    this.hashService = hashService;
  }

  async execute({ userId, data }) {
    if (!userId) throw new Error("userId is required");
    if (!data) throw new Error("data is required");
    return await this.profileRepository.updatePassword(
      userId,
      data,
      this.hashService,
    );
  }
}

module.exports = {
  GetProfileUseCase,
  UpdateProfileUseCase,
  UpdateAvatarUseCase,
  UpdatePasswordUseCase,
};
