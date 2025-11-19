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

export class ProductRepository {
  async listProducts(): Promise<Product[]> {
    try {
      const response = await ApiClient.get<ProductResponse[]>("/products");
      return response.data.map((product) => this.mapToProduct(product));
    } catch (error) {
      throw error;
    }
  }

  async listByCategory(categoryId: string): Promise<Product[]> {
    try {
      const response = await ApiClient.get<ProductResponse[]>(`/category/product/${categoryId}`);
      return response.data.map((product) => this.mapToProduct(product));
    } catch (error) {
      throw error;
    }
  }

  async createProduct(data: {
    name: string;
    price: string;
    description: string;
    category_id: string;
    file: File;
  }): Promise<Product> {
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('price', data.price);
      formData.append('description', data.description);
      formData.append('category_id', data.category_id);
      formData.append('file', data.file);

      const response = await ApiClient.post<ProductResponse>("/product", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return this.mapToProduct(response.data);
    } catch (error) {
      throw error;
    }
  }

  async updateProduct(data: {
    product_id: string;
    name: string;
    price: string;
    description: string;
    category_id: string;
    file?: File;
  }): Promise<Product> {
    try {
      const formData = new FormData();
      formData.append('product_id', data.product_id);
      formData.append('name', data.name);
      formData.append('price', data.price);
      formData.append('description', data.description);
      formData.append('category_id', data.category_id);
      
      if (data.file) {
        formData.append('file', data.file);
      }

      const response = await ApiClient.put<ProductResponse>("/product", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return this.mapToProduct(response.data);
    } catch (error) {
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
