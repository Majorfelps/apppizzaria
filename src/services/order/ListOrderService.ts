import prismaClient from "../../prisma";

class ListOrderService{
    async execute(){

        const orders = await prismaClient.order.findMany({
            where:{
                draft: false,
                status: false,
            },
            orderBy:{
                created_at: 'desc'
            },
            include:{
                items: {
                    include: {
                        product: true
                    }
                }
            }
        })
        return orders
    }

}

export { ListOrderService }