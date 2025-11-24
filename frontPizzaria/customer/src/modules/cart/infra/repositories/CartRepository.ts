import { Cart, CartItem } from "../../domain/entities/Cart";

export class CartRepository {
  private readonly CART_KEY = "@pizzaria:cart";

  saveCart(cart: Cart): void {
    if (typeof window !== "undefined") {
      const cartData = {
        items: cart.items,
      };
      localStorage.setItem(this.CART_KEY, JSON.stringify(cartData));
    }
  }

  loadCart(): Cart {
    if (typeof window !== "undefined") {
      const cartData = localStorage.getItem(this.CART_KEY);
      if (cartData) {
        const parsed = JSON.parse(cartData);
        const cart = new Cart();

        parsed.items.forEach((item: any) => {
          const cartItem = new CartItem(
            item.productId,
            item.productName,
            item.price,
            item.quantity,
            item.banner
          );
          cart.addItem(cartItem);
        });

        return cart;
      }
    }

    return new Cart();
  }

  clearCart(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(this.CART_KEY);
    }
  }
}
