import { OrderRepository } from "../../infra/repositories/OrderRepository";

export interface DetailOrderInput {
  orderId: string;
}

export interface DetailOrderOutput {
  id: string;
  table: number;
  name: string;
  status: string;
  total: number;
  items: Array<{
    id: string;
    name: string;
    description: string;
    price: string;
    quantity: number;
  }>;
}

export class DetailOrderUseCase {
  constructor(private orderRepository: OrderRepository) {}

  async execute(input: DetailOrderInput): Promise<DetailOrderOutput> {
    const order = await this.orderRepository.getOrderDetail(input.orderId);

    return {
      id: order.id,
      table: order.table,
      name: order.name || "",
      status: order.status,
      total: order.getTotal(),
      items: order.items?.map((item) => ({
        id: item.id,
        name: item.productName,
        description: item.productName,
        price: item.price,
        quantity: item.amount,
      })) || [],
    };
  }
}
