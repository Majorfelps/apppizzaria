import prismaClient from "../../prisma";

interface OrderRequest {
    order_id: string;
}

class SendOrderService {
    async execute({ order_id }: OrderRequest) {
        try {
            const order = await prismaClient.order.update({
                where: {
                    id: order_id
                },
                data: {
                    draft: false
                }
            });

            return order;
        } catch (error) {
            console.error("Erro ao enviar o pedido:", error);
            throw new Error("Erro ao enviar o pedido");
        }
    }
}

export { SendOrderService };
