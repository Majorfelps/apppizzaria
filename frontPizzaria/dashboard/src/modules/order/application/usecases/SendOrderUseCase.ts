import { OrderRepository } from "../../infra/repositories/OrderRepository";

export interface SendOrderInput {
  orderId: string;
}

export interface SendOrderOutput {
  id: string;
  status: string;
  message: string;
}

export class SendOrderUseCase {
  constructor(private orderRepository: OrderRepository) {}

  async execute(input: SendOrderInput): Promise<SendOrderOutput> {
    const order = await this.orderRepository.sendOrder(input.orderId);

    return {
      id: order.id,
      status: order.status,
      message: "Pedido enviado para a cozinha",
    };
  }
}
