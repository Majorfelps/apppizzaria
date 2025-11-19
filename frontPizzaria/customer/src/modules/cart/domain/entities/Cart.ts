// Customer - Cart Domain Entity
export interface ICartItem {
  productId: string;
  productName: string;
  price: string;
  quantity: number;
  banner: string;
}

export class CartItem implements ICartItem {
  constructor(
    public productId: string,
    public productName: string,
    public price: string,
    public quantity: number,
    public banner: string
  ) {}

  static create(data: ICartItem): CartItem {
    return new CartItem(
      data.productId,
      data.productName,
      data.price,
      data.quantity,
      data.banner
    );
  }

  getSubtotal(): number {
    return parseFloat(this.price) * this.quantity;
  }

  updateQuantity(quantity: number): void {
    if (quantity < 1) {
      throw new Error('Quantidade deve ser maior que 0');
    }
    this.quantity = quantity;
  }
}

export interface ICart {
  items: ICartItem[];
  addItem(item: ICartItem): void;
  removeItem(productId: string): void;
  updateItemQuantity(productId: string, quantity: number): void;
  clear(): void;
  getTotal(): number;
  getItemCount(): number;
  isEmpty(): boolean;
}

export class Cart implements ICart {
  constructor(public items: CartItem[] = []) {}

  addItem(item: ICartItem): void {
    const existingItem = this.items.find(i => i.productId === item.productId);
    
    if (existingItem) {
      existingItem.updateQuantity(existingItem.quantity + item.quantity);
    } else {
      this.items.push(CartItem.create(item));
    }
  }

  removeItem(productId: string): void {
    this.items = this.items.filter(item => item.productId !== productId);
  }

  updateItemQuantity(productId: string, quantity: number): void {
    const item = this.items.find(i => i.productId === productId);
    if (item) {
      item.updateQuantity(quantity);
    }
  }

  clear(): void {
    this.items = [];
  }

  getTotal(): number {
    return this.items.reduce((acc, item) => acc + item.getSubtotal(), 0);
  }

  getItemCount(): number {
    return this.items.reduce((acc, item) => acc + item.quantity, 0);
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  static create(): Cart {
    return new Cart();
  }
}
