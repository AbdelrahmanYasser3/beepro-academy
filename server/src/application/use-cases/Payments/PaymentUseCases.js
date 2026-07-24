const { NotFoundError } = require("../../../domain/errors/AppError");

class ListPaymentsUseCase {
  constructor({ paymentRepository }) {
    this.paymentRepository = paymentRepository;
  }

  async execute({ userId, limit, offset }) {
    return await this.paymentRepository.list({ userId, limit, offset });
  }
}

class GetPaymentUseCase {
  constructor({ paymentRepository }) {
    this.paymentRepository = paymentRepository;
  }

  async execute({ id, userId }) {
    if (!id) throw new Error("id is required");
    const payment = await this.paymentRepository.getById(id, userId);
    if (!payment) throw new NotFoundError("Payment");
    return payment;
  }
}

class GetPaymentHistoryUseCase {
  constructor({ paymentRepository }) {
    this.paymentRepository = paymentRepository;
  }

  async execute({ userId }) {
    return await this.paymentRepository.getHistory(userId);
  }
}

class CreatePaymentUseCase {
  constructor({ paymentRepository }) {
    this.paymentRepository = paymentRepository;
  }

  async execute({ userId, data }) {
    if (!data) throw new Error("data is required");
    return await this.paymentRepository.create({
      ...data,
      user_id: userId || data.user_id,
    });
  }
}

class UpdatePaymentUseCase {
  constructor({ paymentRepository }) {
    this.paymentRepository = paymentRepository;
  }

  async execute({ id, userId, data }) {
    if (!id) throw new Error("id is required");
    if (!data) throw new Error("data is required");
    return await this.paymentRepository.update(id, userId, data);
  }
}

module.exports = {
  ListPaymentsUseCase,
  GetPaymentUseCase,
  GetPaymentHistoryUseCase,
  CreatePaymentUseCase,
  UpdatePaymentUseCase,
};
