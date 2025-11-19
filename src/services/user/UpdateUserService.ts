import prismaClient from "../../prisma";
import { hash } from "bcryptjs";

interface UpdateUserRequest {
    user_id: string;
    name?: string;
    email?: string;
    password?: string;
}

class UpdateUserService {
    async execute({ user_id, name, email, password }: UpdateUserRequest) {
        
        // Verificar se o usuário existe
        const userExists = await prismaClient.user.findFirst({
            where: { id: user_id }
        });

        if (!userExists) {
            throw new Error("User not found");
        }

        // Se está alterando o email, verificar se já não existe outro usuário com esse email
        if (email && email !== userExists.email) {
            const emailAlreadyExists = await prismaClient.user.findFirst({
                where: { 
                    email: email,
                    NOT: { id: user_id }
                }
            });

            if (emailAlreadyExists) {
                throw new Error("Email already in use");
            }
        }

        // Preparar dados para atualização
        const updateData: any = {
            name: name || userExists.name,
            email: email || userExists.email,
            updated_at: new Date()
        };

        // Se forneceu uma nova senha, fazer o hash
        if (password) {
            const passwordHash = await hash(password, 8);
            updateData.password = passwordHash;
        }

        const user = await prismaClient.user.update({
            where: { id: user_id },
            data: updateData,
            select: {
                id: true,
                name: true,
                email: true,
                created_at: true,
                updated_at: true
            }
        });

        return user;
    }
}

export { UpdateUserService };
