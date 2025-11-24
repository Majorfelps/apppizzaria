import { ProductRepository } from "../../infra/repositories/ProductRepository";

interface CreateProductInput {
  name: string;
  price: string;
  description: string;
  category_id: string;
  file: File;
}

interface UpdateProductInput {
  product_id: string;
  name: string;
  price: string;
  description: string;
  category_id: string;
  file?: File;
}

export class CreateProductUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute(data: CreateProductInput) {
    if (!data.name.trim()) {
      throw new Error("Nome do produto é obrigatório");
    }
    if (!data.price.trim()) {
      throw new Error("Preço é obrigatório");
    }
    if (!data.description.trim()) {
      throw new Error("Descrição é obrigatória");
    }
    if (!data.category_id) {
      throw new Error("Categoria é obrigatória");
    }
    if (!data.file) {
      throw new Error("Imagem é obrigatória");
    }

    const product = await this.productRepository.createProduct(data);
    return product;
  }
}

export class UpdateProductUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute(data: UpdateProductInput) {
    if (!data.name.trim()) {
      throw new Error("Nome do produto é obrigatório");
    }
    if (!data.price.trim()) {
      throw new Error("Preço é obrigatório");
    }
    if (!data.description.trim()) {
      throw new Error("Descrição é obrigatória");
    }
    if (!data.category_id) {
      throw new Error("Categoria é obrigatória");
    }

    const product = await this.productRepository.updateProduct(data);
    return product;
  }
}
