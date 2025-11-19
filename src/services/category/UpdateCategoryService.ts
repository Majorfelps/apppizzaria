import prismaClient from "../../prisma";

interface CategoryRequest {
    category_id: string;
    name: string;
}

class UpdateCategoryService {
    async execute({ category_id, name }: CategoryRequest) {
        if (!name) {
            throw new Error("Nome inválido");
        }

        const category = await prismaClient.category.update({
            where: {
                id: category_id
            },
            data: {
                name: name
            }
        });

        return category;
    }
}

export { UpdateCategoryService }
