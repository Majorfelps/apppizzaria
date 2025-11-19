import { AuthRepository } from "../../infra/repositories/AuthRepository";
import { User } from "../../domain/entities/User";

export class GetCurrentUserUseCase {
  constructor(private authRepository: AuthRepository) {}

  execute(): User | null {
    return this.authRepository.getCurrentUser();
  }
}
