import { ApiClient } from "@/shared/infra/http/ApiClient";
import { TokenStorage } from "@/shared/infra/storage/TokenStorage";
import { User } from "../../domain/entities/User";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignUpRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginResponse {
  id: string;
  name: string;
  email: string;
  token: string;
  role?: string;
}

export class AuthRepository {
  private tokenStorage = new TokenStorage();

  async login(request: LoginRequest): Promise<User> {
    try {
      const response = await ApiClient.post<LoginResponse>("/session", request);
      const { id, name, email, token, role = "attendant" } = response.data;

      // Salva token e usuário no localStorage
      ApiClient.setToken(token);
      
      const user = { id, name, email, role };
      this.tokenStorage.setUser(user);

      return User.create({
        id,
        name,
        email,
        role: role as "admin" | "attendant" | "kitchen",
      });
    } catch (error) {
      throw error;
    }
  }

  async signUp(request: SignUpRequest): Promise<User> {
    try {
      const response = await ApiClient.post<User>("/users", request);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async logout(): Promise<void> {
    ApiClient.removeToken();
    this.tokenStorage.removeUser();
  }

  getCurrentUser(): User | null {
    const user = this.tokenStorage.getUser();
    if (!user) return null;

    return User.create({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role as "admin" | "attendant" | "kitchen",
    });
  }

  isAuthenticated(): boolean {
    return ApiClient.getToken() !== null;
  }
}
