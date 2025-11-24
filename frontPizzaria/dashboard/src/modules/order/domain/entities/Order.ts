// Dashboard - Order Domain Entity
export type OrderStatusType = 'draft' | 'sent' | 'finished';

export interface IOrderItem {
  id: string;
  productId: string;
  productName: string;
  price: string;
  amount: number;
}

export interface IOrder {
  id: string;
  table: number;
  status: OrderStatusType;
  draft: boolean;
  name?: string;
  items?: IOrderItem[];
  createdAt: Date;
  updatedAt: Date;
}

export class Order implements IOrder {
  constructor(
    public id: string,
    public table: number,
    public status: OrderStatusType,
    public draft: boolean,
    public name?: string,
    public items?: IOrderItem[],
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date()
  ) {}

  static create(data: Omit<IOrder, 'createdAt' | 'updatedAt'>): Order {
    return new Order(
      data.id,
      data.table,
      data.status,
      data.draft,
      data.name,
      data.items
    );
  }

  getTotal(): number {
    if (!this.items) return 0;
    return this.items.reduce((acc, item) => {
      return acc + (parseFloat(item.price) * item.amount);
    }, 0);
  }

  canFinish(): boolean {
    return this.status === 'sent';
  }

  canSend(): boolean {
    return this.status === 'draft' && (this.items?.length ?? 0) > 0;
  }
}

export class OrderStatus {
  static readonly DRAFT = 'draft';
  static readonly SENT = 'sent';
  static readonly FINISHED = 'finished';

  static getLabel(status: OrderStatusType): string {
    const labels: Record<OrderStatusType, string> = {
      draft: 'Rascunho',
      sent: 'Enviado',
      finished: 'Finalizado'
    };
    return labels[status];
  }

  static getColor(status: OrderStatusType): string {
    const colors: Record<OrderStatusType, string> = {
      draft: '#FFA500',
      sent: '#3B82F6',
      finished: '#10B981'
    };
    return colors[status];
  }
}
