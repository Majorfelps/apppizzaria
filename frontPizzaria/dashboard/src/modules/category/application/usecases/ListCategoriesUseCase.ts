import { CategoryRepository } from "../../infra/repositories/CategoryRepository";

export class ListCategoriesUseCase {
  constructor(private categoryRepository: CategoryRepository) {}

  async execute() {
    const categories = await this.categoryRepository.listCategories();
    return { categories };
  }
}
