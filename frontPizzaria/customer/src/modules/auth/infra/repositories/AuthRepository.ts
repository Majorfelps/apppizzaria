import { ApiClient } from "@/shared/infra/http/ApiClient";
import { TokenStorage } from "@/shared/infra/storage/TokenStorage";
import { Customer } from "../../domain/entities/Customer";

export interface SignUpRequest {
  name: string;
  email: string;
  password: string;
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  id: string;
  name: string;
  email: string;
  token: string;
}

export class AuthRepository {
  private tokenStorage = new TokenStorage();

  async signUp(request: SignUpRequest): Promise<Customer> {
    try {
      const response = await ApiClient.post<AuthResponse>("/users", request);
      const { id, name, email, token } = response.data;

      ApiClient.setToken(token);
      this.tokenStorage.setUser({ id, name, email });

      return Customer.create({
        id,
        name,
        email,
      });
    } catch (error) {
      throw error;
    }
  }

  async signIn(request: SignInRequest): Promise<Customer> {
    try {
      const response = await ApiClient.post<AuthResponse>("/session", request);
      const { id, name, email, token } = response.data;

      ApiClient.setToken(token);
      this.tokenStorage.setUser({ id, name, email });

      return Customer.create({
        id,
        name,
        email,
      });
    } catch (error) {
      throw error;
    }
  }

  async logout(): Promise<void> {
    ApiClient.removeToken();
    this.tokenStorage.removeUser();
  }

  getCurrentUser(): Customer | null {
    const user = this.tokenStorage.getUser();
    if (!user) return null;

    return Customer.create({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  }

  isAuthenticated(): boolean {
    return ApiClient.getToken() !== null;
  }
}
