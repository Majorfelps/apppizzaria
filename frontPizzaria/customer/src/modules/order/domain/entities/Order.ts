export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export class Order {
  items: OrderItem[] = [];

  addItem(item: OrderItem): void {
    this.items.push(item);
  }

  getTotal(): number {
    return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }
}
