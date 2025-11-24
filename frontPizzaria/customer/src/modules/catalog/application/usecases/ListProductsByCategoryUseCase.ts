import { CatalogRepository } from "../../infra/repositories/CatalogRepository";

export interface ListProductsByCategoryInput {
  categoryId: string;
}

export interface ListProductsByCategoryOutput {
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

export class ListProductsByCategoryUseCase {
  constructor(private catalogRepository: CatalogRepository) {}

  async execute(input: ListProductsByCategoryInput): Promise<ListProductsByCategoryOutput> {
    const products = await this.catalogRepository.listProductsByCategory(input.categoryId);

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
