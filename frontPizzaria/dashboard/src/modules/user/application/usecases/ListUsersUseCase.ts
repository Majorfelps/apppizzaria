import { UserRepository } from "../../infra/repositories/UserRepository";

export class ListUsersUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute() {
    const users = await this.userRepository.listUsers();
    return { users };
  }
}
