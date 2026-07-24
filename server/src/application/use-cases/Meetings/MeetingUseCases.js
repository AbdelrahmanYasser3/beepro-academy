const { NotFoundError } = require("../../../domain/errors/AppError");

class ListMeetingsUseCase {
  constructor({ meetingRepository }) {
    this.meetingRepository = meetingRepository;
  }

  async execute({ userId, search, sortBy, sortOrder, limit, offset }) {
    return await this.meetingRepository.list({
      userId,
      search,
      sortBy,
      sortOrder,
      limit: Number(limit) || 20,
      offset: Number(offset) || 0,
    });
  }
}

class GetMeetingUseCase {
  constructor({ meetingRepository }) {
    this.meetingRepository = meetingRepository;
  }

  async execute({ id }) {
    if (!id) throw new Error("id is required");
    const meeting = await this.meetingRepository.getById(id);
    if (!meeting) throw new NotFoundError("Meeting");
    return meeting;
  }
}

class CreateMeetingUseCase {
  constructor({ meetingRepository }) {
    this.meetingRepository = meetingRepository;
  }

  async execute({ userId, data }) {
    if (!data) throw new Error("data is required");
    return await this.meetingRepository.create({
      ...data,
      organizer_id: userId || data.organizer_id || null,
    });
  }
}

class UpdateMeetingUseCase {
  constructor({ meetingRepository }) {
    this.meetingRepository = meetingRepository;
  }

  async execute({ id, data }) {
    if (!id) throw new Error("id is required");
    if (!data) throw new Error("data is required");
    return await this.meetingRepository.update(id, data);
  }
}

class DeleteMeetingUseCase {
  constructor({ meetingRepository }) {
    this.meetingRepository = meetingRepository;
  }

  async execute({ id }) {
    if (!id) throw new Error("id is required");
    return await this.meetingRepository.delete(id);
  }
}

module.exports = {
  ListMeetingsUseCase,
  GetMeetingUseCase,
  CreateMeetingUseCase,
  UpdateMeetingUseCase,
  DeleteMeetingUseCase,
};
