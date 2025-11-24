import { UserRepository } from "../../infra/repositories/UserRepository";

interface UpdateUserRequest {
  user_id: string;
  name?: string;
  email?: string;
  password?: string;
}

export class UpdateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(data: UpdateUserRequest) {
    if (!data.user_id) {
      throw new Error("User ID is required");
    }

    const user = await this.userRepository.updateUser(data);
    return user;
  }
}
