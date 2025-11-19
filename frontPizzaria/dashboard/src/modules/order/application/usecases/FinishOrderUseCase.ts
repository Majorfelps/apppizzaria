import { OrderRepository } from "../../infra/repositories/OrderRepository";

export interface FinishOrderInput {
  orderId: string;
}

export interface FinishOrderOutput {
  id: string;
  status: string;
  message: string;
}

export class FinishOrderUseCase {
  constructor(private orderRepository: OrderRepository) {}

  async execute(input: FinishOrderInput): Promise<FinishOrderOutput> {
    const order = await this.orderRepository.finishOrder(input.orderId);

    return {
      id: order.id,
      status: order.status,
      message: "Pedido finalizado",
    };
  }
}
