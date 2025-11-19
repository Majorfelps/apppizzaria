import { ApiClient } from "@/shared/infra/http/ApiClient";
import { Order } from "../../domain/entities/Order";

export interface OrderResponse {
  id: string;
  table: number;
  name: string;
  status: boolean | "draft" | "sent" | "finished";
  draft: boolean;
  total?: string;
  items: Array<{
    id: string;
    amount: number;
    order_id: string;
    product_id: string;
    product: {
      id: string;
      name: string;
      price: string;
      description: string;
      banner: string;
      category_id: string;
    };
  }>;
  created_at: string;
  updated_at: string;
}

export class OrderRepository {
  async listOrders(): Promise<Order[]> {
    try {
      console.log("Chamando API /orders...");
      const response = await ApiClient.get<OrderResponse[]>("/orders");
      console.log("Resposta recebida:", response);
      
      // Verifica se response.data existe e é um array
      if (!response.data || !Array.isArray(response.data)) {
        console.error("Resposta inválida do servidor:", response);
        return [];
      }
      
      console.log("Pedidos encontrados:", response.data.length);
      return response.data.map((order) => this.mapToOrder(order));
    } catch (error) {
      console.error("Erro ao listar pedidos:", error);
      throw error;
    }
  }

  async getOrderDetail(orderId: string): Promise<Order> {
    try {
      const response = await ApiClient.get<OrderResponse>(`/order/detail?order_id=${orderId}`);
      return this.mapToOrder(response.data);
    } catch (error) {
      throw error;
    }
  }

  async sendOrder(orderId: string): Promise<Order> {
    try {
      const response = await ApiClient.put<OrderResponse>(`/order/send`, { order_id: orderId });
      return this.mapToOrder(response.data);
    } catch (error) {
      throw error;
    }
  }

  async finishOrder(orderId: string): Promise<Order> {
    try {
      const response = await ApiClient.put<OrderResponse>(`/order/finish`, { order_id: orderId });
      return this.mapToOrder(response.data);
    } catch (error) {
      throw error;
    }
  }

  private mapToOrder(data: OrderResponse): Order {
    return Order.create({
      id: data.id,
      table: data.table,
      status: data.status as "draft" | "sent" | "finished",
      draft: data.draft,
      name: data.name || "",
      items: (data.items || []).map((item) => ({
        id: item.id,
        productId: item.product_id,
        productName: item.product.name,
        price: item.product.price,
        amount: item.amount,
      })),
    });
  }
}
