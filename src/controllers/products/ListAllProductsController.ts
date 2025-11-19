import { Request, Response } from "express";
import { ListAllProductsService } from "../../services/products/ListAllProductsService";

class ListAllProductsController{
    async handle(req: Request, res: Response){

        const listAllProducts = new ListAllProductsService();

        const products = await listAllProducts.execute();

        return res.json(products)
    }
}

export { ListAllProductsController }
