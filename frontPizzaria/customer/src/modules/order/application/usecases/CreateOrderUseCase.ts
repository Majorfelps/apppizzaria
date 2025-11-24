import { OrderRepository } from "../../infra/repositories/OrderRepository";
import { CartItem } from "@/modules/cart/domain/entities/Cart";

interface CreateOrderInput {
  table: number;
  name: string;
  items: CartItem[];
}

export class CreateOrderUseCase {
  constructor(private orderRepository: OrderRepository) {}

  async execute({ table, name, items }: CreateOrderInput): Promise<string> {
    if (items.length === 0) {
      throw new Error("Carrinho vazio");
    }

    // 1. Criar o pedido
    const order = await this.orderRepository.createOrder({
      table,
      name,
    });

    // 2. Adicionar cada item ao pedido
    for (const item of items) {
      await this.orderRepository.addItem({
        order_id: order.id,
        product_id: item.productId,
        amount: item.quantity,
      });
    }

    // 3. Enviar o pedido (marcar como não-rascunho)
    await this.orderRepository.sendOrder({
      order_id: order.id,
    });

    return order.id;
  }
}
