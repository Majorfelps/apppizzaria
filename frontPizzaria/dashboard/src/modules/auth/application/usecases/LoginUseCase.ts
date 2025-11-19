import { AuthRepository, LoginRequest } from "../../infra/repositories/AuthRepository";

export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginOutput {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export class LoginUseCase {
  constructor(private authRepository: AuthRepository) {}

  async execute(input: LoginInput): Promise<LoginOutput> {
    const request: LoginRequest = {
      email: input.email,
      password: input.password,
    };

    const user = await this.authRepository.login(request);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }
}
