export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export interface IProduct {
  id: string;           // Уникальный идентификатор товара
  title: string;        // Название товара
  image: string;        // URL изображения карточки
  category: string;     // Категория товара
  price: number | null; // Цена (цифра или null для "бесценных" товаров)
  description: string;  // Описание товара
}

export interface ICustomer {
  payment: 'card' | 'cash'; // Способ оплаты
  address: string;          // Адрес доставки
  email: string;            // Email
  phone: string;            // Телефон
}

// Типы для API ответов 
export interface ProductsResponse {
    total: number;
    items: IProduct[]; // Используем существующий IProduct
}

export interface OrderRequest {
    payment: string; 
    email: string;
    phone: string;
    address: string;
    total: number;
    items: string[]; // Массив айди товаров
}

export interface OrderResponse {
    id: string;
    total: number;
}