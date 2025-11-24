import { CategoryRepository } from "../../infra/repositories/CategoryRepository";

interface CreateCategoryInput {
  name: string;
}

export class CreateCategoryUseCase {
  constructor(private categoryRepository: CategoryRepository) {}

  async execute({ name }: CreateCategoryInput) {
    if (!name.trim()) {
      throw new Error("Nome da categoria é obrigatório");
    }

    const category = await this.categoryRepository.createCategory({ name });
    return category;
  }
}
