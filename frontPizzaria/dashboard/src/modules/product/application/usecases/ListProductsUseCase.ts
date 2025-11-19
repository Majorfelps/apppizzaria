import { ProductRepository } from "../../infra/repositories/ProductRepository";

export interface ListProductsOutput {
  products: Array<{
    id: string;
    name: string;
    description: string;
    price: number;
    banner: string;
    category: {
      id: string;
      name: string;
    };
  }>;
}

export class ListProductsUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute(): Promise<ListProductsOutput> {
    const products = await this.productRepository.listProducts();

    return {
      products: products.map((product) => ({
        id: product.id,
        name: product.name,
        description: product.description,
        price: parseFloat(product.price),
        banner: product.banner,
        category: product.category || { id: "", name: "" },
      })),
    };
  }
}
