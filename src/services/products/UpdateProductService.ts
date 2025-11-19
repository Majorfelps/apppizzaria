import prismaClient from "../../prisma";

interface ProductRequest {
    product_id: string;
    name?: string;
    price?: string;
    description?: string;
    banner?: string;
    category_id?: string;
}

class UpdateProductService {
    async execute({ product_id, name, price, description, banner, category_id }: ProductRequest) {
        
        // Busca o produto atual
        const productExists = await prismaClient.product.findUnique({
            where: {
                id: product_id
            }
        });

        if (!productExists) {
            throw new Error("Produto não encontrado");
        }

        // Atualiza apenas os campos fornecidos
        const product = await prismaClient.product.update({
            where: {
                id: product_id
            },
            data: {
                name: name || productExists.name,
                price: price || productExists.price,
                description: description || productExists.description,
                banner: banner || productExists.banner,
                category_id: category_id || productExists.category_id
            },
            select: {
                id: true,
                name: true,
                price: true,
                description: true,
                banner: true,
                category_id: true,
                category: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });

        return product;
    }
}

export { UpdateProductService }
