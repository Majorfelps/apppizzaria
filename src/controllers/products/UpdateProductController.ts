import { Request, Response } from 'express';
import { UpdateProductService } from '../../services/products/UpdateProductService';

class UpdateProductController {
    async handle(req: Request, res: Response) {
        const { product_id, name, price, description, category_id } = req.body;

        const updateProductService = new UpdateProductService();

        let banner = undefined;

        // Se tiver arquivo, usa o novo, senão mantém o antigo
        if (req.file) {
            const { filename } = req.file;
            banner = filename;
        }

        const product = await updateProductService.execute({
            product_id,
            name,
            price,
            description,
            banner,
            category_id
        });

        return res.json(product);
    }
}

export { UpdateProductController }
