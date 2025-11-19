import { CartRepository } from "../../infra/repositories/CartRepository";
import { CartItem } from "../../domain/entities/Cart";

export interface GetCartOutput {
  items: Array<{
    productId: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  total: number;
  itemCount: number;
}

export class GetCartUseCase {
  constructor(private cartRepository: CartRepository) {}

  execute(): GetCartOutput {
    const cart = this.cartRepository.loadCart();

    return {
      items: cart.items.map((item: CartItem) => ({
        productId: item.productId,
        name: item.productName,
        price: parseFloat(item.price),
        quantity: item.quantity,
      })),
      total: cart.getTotal(),
      itemCount: cart.getItemCount(),
    };
  }
}
