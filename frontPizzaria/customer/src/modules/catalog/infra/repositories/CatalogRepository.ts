import { ApiClient } from "@/shared/infra/http/ApiClient";
import { Product } from "../../domain/entities/Product";

export interface CategoryResponse {
  id: string;
  name: string;
}

export interface ProductResponse {
  id: string;
  name: string;
  description: string;
  price: string;
  banner: string;
  category_id: string;
  category: CategoryResponse;
}

export interface ListProductsResponse {
  category: CategoryResponse;
  products: ProductResponse[];
}

export class CatalogRepository {
  async listCategories(): Promise<CategoryResponse[]> {
    try {
      const response = await ApiClient.get<CategoryResponse[]>("/category");
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async listProductsByCategory(categoryId: string): Promise<Product[]> {
    try {
      const response = await ApiClient.get<ListProductsResponse>(`/category/product/${categoryId}`);
      return response.data.products.map((product) => this.mapToProduct(product));
    } catch (error) {
      throw error;
    }
  }

  async listAllProducts(): Promise<Product[]> {
    try {
      const response = await ApiClient.get<ProductResponse[]>("/products");
      
      if (!response.data || !Array.isArray(response.data)) {
        console.error("Resposta inválida do servidor:", response);
        return [];
      }
      
      return response.data.map((product) => this.mapToProduct(product));
    } catch (error) {
      console.error("Erro ao listar produtos:", error);
      throw error;
    }
  }

  private mapToProduct(data: ProductResponse): Product {
    return Product.create({
      id: data.id,
      name: data.name,
      description: data.description,
      price: data.price,
      banner: data.banner,
      categoryId: data.category_id,
      category: {
        id: data.category_id,
        name: data.category.name,
      },
    });
  }
}
