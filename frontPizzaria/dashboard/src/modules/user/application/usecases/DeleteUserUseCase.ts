import { UserRepository } from "../../infra/repositories/UserRepository";

export class DeleteUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(user_id: string) {
    if (!user_id) {
      throw new Error("User ID is required");
    }

    await this.userRepository.deleteUser(user_id);
  }
}
