import { AuthRepository } from "../../infra/repositories/AuthRepository";

export interface SignUpInput {
  name: string;
  email: string;
  password: string;
}

export interface SignUpOutput {
  customer: {
    id: string;
    name: string;
    email: string;
  };
}

export class SignUpUseCase {
  constructor(private authRepository: AuthRepository) {}

  async execute(input: SignUpInput): Promise<SignUpOutput> {
    const customer = await this.authRepository.signUp(input);

    return {
      customer: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
      },
    };
  }
}
