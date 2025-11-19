import { ApiClient } from "@/shared/infra/http/ApiClient";

interface User {
  id: string;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

interface UpdateUserData {
  user_id: string;
  name?: string;
  email?: string;
  password?: string;
}

export class UserRepository {
  async listUsers(): Promise<User[]> {
    const response = await ApiClient.get<User[]>("/users");
    return response.data;
  }

  async updateUser(data: UpdateUserData): Promise<User> {
    const response = await ApiClient.put<User>("/user", data);
    return response.data;
  }

  async deleteUser(user_id: string): Promise<void> {
    await ApiClient.delete("/user", { data: { user_id } });
  }
}
