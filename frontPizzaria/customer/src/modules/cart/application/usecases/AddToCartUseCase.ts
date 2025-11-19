import { CartRepository } from "../../infra/repositories/CartRepository";
import { CartItem } from "../../domain/entities/Cart";

export interface AddToCartInput {
  productId: string;
  productName: string;
  productPrice: number;
  productBanner: string;
  quantity: number;
}

export interface AddToCartOutput {
  message: string;
  cartTotal: number;
  itemCount: number;
}

export class AddToCartUseCase {
  constructor(private cartRepository: CartRepository) {}

  execute(input: AddToCartInput): AddToCartOutput {
    const cart = this.cartRepository.loadCart();

    const cartItem = new CartItem(
      input.productId,
      input.productName,
      input.productPrice.toString(),
      input.quantity,
      input.productBanner
    );
    cart.addItem(cartItem);

    this.cartRepository.saveCart(cart);

    return {
      message: `${input.productName} adicionado ao carrinho`,
      cartTotal: cart.getTotal(),
      itemCount: cart.getItemCount(),
    };
  }
}
