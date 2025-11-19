import { Request, Response } from "express";
import { DeleteUserService } from "../../services/user/DeleteUserService";

class DeleteUserController {
    async handle(req: Request, res: Response) {
        const { user_id } = req.body;

        const deleteUserService = new DeleteUserService();

        const result = await deleteUserService.execute({ user_id });

        return res.json(result);
    }
}

export { DeleteUserController };
