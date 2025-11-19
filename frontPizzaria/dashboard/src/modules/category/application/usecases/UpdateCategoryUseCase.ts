import { CategoryRepository } from "../../infra/repositories/CategoryRepository";

interface UpdateCategoryInput {
  category_id: string;
  name: string;
}

export class UpdateCategoryUseCase {
  constructor(private categoryRepository: CategoryRepository) {}

  async execute({ category_id, name }: UpdateCategoryInput) {
    if (!name.trim()) {
      throw new Error("Nome da categoria é obrigatório");
    }

    const category = await this.categoryRepository.updateCategory({ category_id, name });
    return category;
  }
}
