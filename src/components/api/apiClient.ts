import { Api } from "../base/Api";
import { IProduct, ProductsResponse, OrderRequest, OrderResponse } from "../../types";
import { apiProducts } from "../../utils/data";

export class ApiClient {
    constructor(private api: Api) {}

    async getProducts(): Promise<IProduct[]> {
        try {
            const response = await this.api.get<ProductsResponse>('/product/');
            return response.items;
        } catch (error) {
            console.error('Ошибка при получении товаров:', error);
            return apiProducts.items;
        }
    }

    async createOrder(orderData: OrderRequest): Promise<OrderResponse> {
        const apiOrderData = {
            payment: orderData.payment === 'card' ? 'online' : 'offline',
            email: orderData.email,
            phone: orderData.phone,
            address: orderData.address,
            total: orderData.total,
            items: orderData.items,
        };

        return await this.api.post<OrderResponse>('/order', apiOrderData, 'POST');
    }
}