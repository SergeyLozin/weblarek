import './scss/styles.scss';
import { apiProducts } from './utils/data';
import { IProduct, ICustomer, IApi } from './types';
import { Api } from './components/base/Api';
import { ProductsResponse } from './types';
import { OrderRequest } from './types';
import { OrderResponse } from './types';


// КЛАССЫ

class CartModel {
    private items: IProduct[];

    constructor() {
        this.items = [];
    }

    getCartItems(): IProduct[] {
        return [...this.items];
    }

    addProduct(product: IProduct): void {
        this.items.push(product);
    }

    removeProduct(product: IProduct): void {
        const index = this.items.findIndex(item => item.id === product.id);
        if (index !== -1) {
            this.items.splice(index, 1);
        }
    }

    clearCart(): void {
        this.items = [];
    }

    getTotalAmount(): number {
        return this.items.reduce((total, item) => {
            return total + (item.price || 0);
        }, 0);
    }

    getItemsCount(): number {
        return this.items.length;
    }

    hasProduct(id: string): boolean {
        return this.items.some(item => item.id === id);
    }
}

class CustomerModel {
    private data: ICustomer;

    constructor() {
        this.data = {
            payment: 'card',
            email: '',
            phone: '',
            address: ''
        };
    }

    setCustomerData(data: ICustomer): void {
        this.data = data;
    }

    getCustomerData(): ICustomer {
        return { ...this.data };
    }

    clearData(): void {
        this.data = {
            payment: 'card',
            email: '',
            phone: '',
            address: ''
        };
    }

    validateData(): boolean {
        const { payment, email, phone, address } = this.data;
        return (payment === 'card' || payment === 'cash') &&
               email.includes('@') &&
               /^\d+$/.test(phone) && phone.length >= 10 &&
               address.trim().length >= 5;
    }
}

class ProductModel {
    private products: IProduct[];
    private selectedProduct: IProduct | null;

    constructor() {
        this.products = [];
        this.selectedProduct = null;
    }

    setProducts(products: IProduct[]): void {
        this.products = products;
    }

    getProducts(): IProduct[] {
        return [...this.products];
    }

    getProductById(id: string): IProduct | undefined {
        return this.products.find(product => product.id === id);
    }

    setSelectedProduct(product: IProduct | null): void {
        this.selectedProduct = product;
    }

    getSelectedProduct(): IProduct | null {
        return this.selectedProduct;
    }
}

class ApiClient {
    constructor(private api: IApi) {}

    async getProducts(): Promise<IProduct[]> {
        try {
            const response = await this.api.get<ProductsResponse>('/product/');
            return response.items;
        } catch (error) {
            console.error('Ошибка при получении товаров:', error);
            throw error;
        }
    }

    async createOrder(orderData: OrderRequest): Promise<OrderResponse> {
        try {
           
            const apiOrderData = {
                ...orderData,
                payment: orderData.payment === 'card' ? 'online' : 'offline'
            };

            return await this.api.post<OrderResponse>('/order/', apiOrderData, 'POST');
        } catch (error) {
            console.error('Ошибка при создании заказа:', error);
            throw error;
        }
    }
}

// ЭКЗЕМПЛЯРЫ

const api = new Api('http://localhost:3000/api/weblarek');
const apiClient = new ApiClient(api); 
const productModel = new ProductModel();
const cartModel = new CartModel();
const customerModel = new CustomerModel();


// ** ProductModel - проверка методов

productModel.setProducts(apiProducts.items);

// проверка getProducts
console.log('getProducts()', productModel.getProducts().length === apiProducts.items.length); // вывод true

// проверка getProductById
console.log('getProductById()', productModel.getProductById(apiProducts.items[0]?.id) !== undefined); // вывод true

// проверка getSelectedProduct и setSelectedProduct
const firstProduct = apiProducts.items[0];
if (firstProduct) {
    productModel.setSelectedProduct(firstProduct);
    const selected = productModel.getSelectedProduct();
    console.log('Выбранный товар:', selected?.title); // выведет выбранный товар и его занвание
    
}

//  ** CartModel - проверка методов

const testProduct: IProduct = {
    id: 'test-1',
    title: 'Тестовый товар',
    description: 'Тестовое описание',
    image: 'test.jpg',
    category: 'тест',
    price: 1000
}; // данные для проверки

cartModel.addProduct(testProduct);

console.log('getCartItems()', cartModel.getCartItems().length === 1); // вывод true
console.log('getItemsCount()', cartModel.getItemsCount() === 1); // вывод true
console.log('getTotalAmount()', cartModel.getTotalAmount() === 1000); // вывод true
console.log('hasProduct()', cartModel.hasProduct('test-1') === true); // вывод true

// проверка метода удаления
if (apiProducts.items.length > 1) {
    cartModel.addProduct(apiProducts.items[1]);
    console.log('Добавлен товар, кол-во:', cartModel.getItemsCount()); // выведет кол-во товаров (2)
    
    cartModel.removeProduct(apiProducts.items[1]);
    console.log('removeProduct()', cartModel.getItemsCount() === 1); // true
}
cartModel.clearCart();
console.log('clearCart()', cartModel.getItemsCount() === 0); //true



// ** CustomerModel - проверка методов  
customerModel.setCustomerData({
    payment: 'card',
    email: 'test@test.com',  
    phone: '79218689001',
    address: 'Москва, ул. Ленина, 1'
}); // данные для теста

console.log('getCustomerData()', customerModel.getCustomerData().email === 'test@test.com'); 
console.log('validateData()', customerModel.validateData() === true);


customerModel.clearData();
const clearedData = customerModel.getCustomerData();
console.log('clearData() работает:', 
    clearedData.payment === 'card' && 
    clearedData.email === '' && 
    clearedData.phone === '' && 
    clearedData.address === ''
);

// ** Запрос на сервер
apiClient.getProducts()
    .then(serverProducts => {
        console.log('Товары получены'); 
        console.log('Получено товаров:', serverProducts.length);
        
        productModel.setProducts(serverProducts);
        console.log('Товары сохранены в ProductModel');
        
        const savedProducts = productModel.getProducts(); 
        console.log('Количество товаров в модели:', savedProducts.length);
        
        // Проверка с данными сервера
        console.log('getProducts() работает:', productModel.getProducts().length === serverProducts.length);
        console.log('getProductById() работает:', productModel.getProductById(serverProducts[0]?.id) !== undefined);
        
        cartModel.clearCart();
        if (serverProducts.length > 0) {
            cartModel.addProduct(serverProducts[0]);
            console.log('addProduct() работает:', cartModel.getItemsCount() === 1);
            console.log('hasProduct() работает:', cartModel.hasProduct(serverProducts[0].id)); 
        }
        
        console.log('validateData() работает:', customerModel.validateData() === true);
        console.log('getProducts() работает:', serverProducts.length > 0);
    })
    .catch(error => {
        console.error('Ошибка при загрузке товаров:', error);
        productModel.setProducts(apiProducts.items);
        
    });