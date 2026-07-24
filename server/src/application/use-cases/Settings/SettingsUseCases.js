class GetSettingsUseCase {
  constructor({ settingsRepository }) {
    this.settingsRepository = settingsRepository;
  }

  async execute({ userId }) {
    if (!userId) throw new Error("userId is required");
    return await this.settingsRepository.getByUserId(userId);
  }
}

class UpdateSettingsUseCase {
  constructor({ settingsRepository }) {
    this.settingsRepository = settingsRepository;
  }

  async execute({ userId, data }) {
    if (!userId) throw new Error("userId is required");
    if (!data) throw new Error("data is required");
    return await this.settingsRepository.update(userId, data);
  }
}

module.exports = { GetSettingsUseCase, UpdateSettingsUseCase };
