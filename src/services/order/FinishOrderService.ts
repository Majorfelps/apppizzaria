import prismaClient from "../../prisma";

interface OrderRequest {
    order_id: string;
}

class FinishOrderService{
        async execute({ order_id }: OrderRequest) {
            try {
                const order = await prismaClient.order.update({
                    where: {
                        id: order_id
                    },
                    data: {
                        status: true
                    }
                });
    
                return order;
            } catch (error) {
                console.error("Erro ao enviar o pedido:", error);
                throw new Error("Erro ao enviar o pedido");
            }
        }
}

export { FinishOrderService }