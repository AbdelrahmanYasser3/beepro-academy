const { NotFoundError } = require("../../../domain/errors/AppError");

class ListChatMessagesUseCase {
  constructor({ chatRepository }) {
    this.chatRepository = chatRepository;
  }

  async execute({ userId, search, limit, offset }) {
    return await this.chatRepository.list({ userId, search, limit, offset });
  }
}

class GetChatMessageUseCase {
  constructor({ chatRepository }) {
    this.chatRepository = chatRepository;
  }

  async execute({ id, userId }) {
    if (!id) throw new Error("id is required");
    const message = await this.chatRepository.getById(id);
    if (!message) throw new NotFoundError("Message");
    if (message.sender_id !== userId && message.receiver_id !== userId) {
      throw new Error("Access denied");
    }
    return message;
  }
}

class CreateChatMessageUseCase {
  constructor({ chatRepository }) {
    this.chatRepository = chatRepository;
  }

  async execute({ userId, data }) {
    if (!data) throw new Error("data is required");
    return await this.chatRepository.create({
      ...data,
      sender_id: userId || data.sender_id,
    });
  }
}

class UpdateChatMessageUseCase {
  constructor({ chatRepository }) {
    this.chatRepository = chatRepository;
  }

  async execute({ id, userId, data }) {
    if (!id) throw new Error("id is required");
    if (!data) throw new Error("data is required");
    return await this.chatRepository.update(id, userId, data);
  }
}

class DeleteChatMessageUseCase {
  constructor({ chatRepository }) {
    this.chatRepository = chatRepository;
  }

  async execute({ id, userId }) {
    if (!id) throw new Error("id is required");
    return await this.chatRepository.delete(id, userId);
  }
}

module.exports = {
  ListChatMessagesUseCase,
  GetChatMessageUseCase,
  CreateChatMessageUseCase,
  UpdateChatMessageUseCase,
  DeleteChatMessageUseCase,
};
