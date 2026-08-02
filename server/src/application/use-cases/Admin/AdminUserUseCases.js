class ListAdminUsersUseCase {
  constructor({ adminUserRepository }) {
    this.adminUserRepository = adminUserRepository;
  }

  execute() {
    return this.adminUserRepository.listUsers();
  }
}

class GetAdminUserDetailsUseCase {
  constructor({ adminUserRepository }) {
    this.adminUserRepository = adminUserRepository;
  }

  execute({ id }) {
    return this.adminUserRepository.getUserDetails(id);
  }
}

class UpdateAdminUserRoleUseCase {
  constructor({ adminUserRepository }) {
    this.adminUserRepository = adminUserRepository;
  }

  execute({ id, role }) {
    return this.adminUserRepository.updateRole(id, role);
  }
}

class SetAdminUserSuspendedUseCase {
  constructor({ adminUserRepository }) {
    this.adminUserRepository = adminUserRepository;
  }

  execute({ id, isSuspended }) {
    return this.adminUserRepository.setSuspended(id, isSuspended);
  }
}

class DeleteAdminUserUseCase {
  constructor({ adminUserRepository }) {
    this.adminUserRepository = adminUserRepository;
  }

  execute({ id }) {
    return this.adminUserRepository.deleteUser(id);
  }
}

module.exports = {
  ListAdminUsersUseCase,
  GetAdminUserDetailsUseCase,
  UpdateAdminUserRoleUseCase,
  SetAdminUserSuspendedUseCase,
  DeleteAdminUserUseCase,
};
