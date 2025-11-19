import { CatalogRepository } from "../../infra/repositories/CatalogRepository";

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
  constructor(private catalogRepository: CatalogRepository) {}

  async execute(): Promise<ListProductsOutput> {
    const products = await this.catalogRepository.listAllProducts();

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
