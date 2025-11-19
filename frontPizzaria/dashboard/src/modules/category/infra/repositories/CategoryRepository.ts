import { ApiClient } from "@/shared/infra/http/ApiClient";

interface Category {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

interface CreateCategoryRequest {
  name: string;
}

interface UpdateCategoryRequest {
  category_id: string;
  name: string;
}

export class CategoryRepository {
  async listCategories(): Promise<Category[]> {
    const response = await ApiClient.get<Category[]>("/category");
    return response.data;
  }

  async createCategory(data: CreateCategoryRequest): Promise<Category> {
    const response = await ApiClient.post<Category>("/category", data);
    return response.data;
  }

  async updateCategory(data: UpdateCategoryRequest): Promise<Category> {
    const response = await ApiClient.put<Category>("/category", data);
    return response.data;
  }
}
