import { ApiClient } from "@/shared/infra/http/ApiClient";

interface CreateOrderRequest {
  table: number;
  name: string;
}

interface CreateOrderResponse {
  id: string;
  table: number;
  name: string;
  draft: boolean;
  status: boolean;
}

interface AddItemRequest {
  order_id: string;
  product_id: string;
  amount: number;
}

interface AddItemResponse {
  id: string;
  order_id: string;
  product_id: string;
  amount: number;
}

interface SendOrderRequest {
  order_id: string;
}

export class OrderRepository {
  async createOrder(data: CreateOrderRequest): Promise<CreateOrderResponse> {
    const response = await ApiClient.post<CreateOrderResponse>("/order", data);
    return response.data;
  }

  async addItem(data: AddItemRequest): Promise<AddItemResponse> {
    const response = await ApiClient.post<AddItemResponse>("/order/add", data);
    return response.data;
  }

  async sendOrder(data: SendOrderRequest): Promise<void> {
    await ApiClient.put("/order/send", data);
  }
}
