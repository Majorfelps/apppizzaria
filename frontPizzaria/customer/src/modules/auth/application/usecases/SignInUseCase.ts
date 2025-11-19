import { AuthRepository } from "../../infra/repositories/AuthRepository";

export interface SignInInput {
  email: string;
  password: string;
}

export interface SignInOutput {
  customer: {
    id: string;
    name: string;
    email: string;
  };
}

export class SignInUseCase {
  constructor(private authRepository: AuthRepository) {}

  async execute(input: SignInInput): Promise<SignInOutput> {
    const customer = await this.authRepository.signIn(input);

    return {
      customer: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
      },
    };
  }
}
