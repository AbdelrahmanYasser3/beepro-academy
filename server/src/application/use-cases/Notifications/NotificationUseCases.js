const { NotFoundError } = require("../../../domain/errors/AppError");

class ListNotificationsUseCase {
  constructor({ notificationRepository }) {
    this.notificationRepository = notificationRepository;
  }

  async execute({ userId, limit, offset }) {
    return await this.notificationRepository.list({ userId, limit, offset });
  }
}

class MarkNotificationReadUseCase {
  constructor({ notificationRepository }) {
    this.notificationRepository = notificationRepository;
  }

  async execute({ id, userId }) {
    if (!id) throw new Error("id is required");
    return await this.notificationRepository.markRead(id, userId);
  }
}

class MarkAllNotificationsReadUseCase {
  constructor({ notificationRepository }) {
    this.notificationRepository = notificationRepository;
  }

  async execute({ userId }) {
    return await this.notificationRepository.markAllRead(userId);
  }
}

class DeleteNotificationUseCase {
  constructor({ notificationRepository }) {
    this.notificationRepository = notificationRepository;
  }

  async execute({ id, userId }) {
    if (!id) throw new Error("id is required");
    return await this.notificationRepository.delete(id, userId);
  }
}

module.exports = {
  ListNotificationsUseCase,
  MarkNotificationReadUseCase,
  MarkAllNotificationsReadUseCase,
  DeleteNotificationUseCase,
};
