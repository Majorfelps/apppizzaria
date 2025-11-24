import { OrderRepository } from "../../infra/repositories/OrderRepository";

export interface ListOrdersOutput {
  orders: Array<{
    id: string;
    table: number;
    name: string;
    status: string;
    total: number;
  }>;
}

export class ListOrdersUseCase {
  constructor(private orderRepository: OrderRepository) {}

  async execute(): Promise<ListOrdersOutput> {
    const orders = await this.orderRepository.listOrders();

    return {
      orders: orders.map((order) => ({
        id: order.id,
        table: order.table,
        name: order.name || "",
        status: order.status,
        total: order.getTotal(),
      })),
    };
  }
}
