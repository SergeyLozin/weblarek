
import './scss/styles.scss';
import { EventEmitter } from './components/base/Events';
import { Api } from './components/base/Api';
import { ApiClient } from './components/api/apiClient';
import { ProductModel } from './components/models/ProductModel';
import { CartModel } from './components/models/CartModel';
import { CustomerModel } from './components/models/CustomerModel';
import { CatalogView } from './components/views/CatalogView';
import { HeaderView } from './components/views/HeaderView';
import { ModalView } from './components/views/ModalView';
import { BasketView } from './components/views/BasketView';
import { OrderFormView } from './components/views/OrderFormView';
import { ContactsFormView } from './components/views/ContactsFormView';
import { SuccessView } from './components/views/SuccessView';
import { CatalogCardView } from './components/views/CatalogCardView';
import { PreviewCardView } from './components/views/PreviewCardView';
import { BasketCardView } from './components/views/BasketCardView';
import { CDN_URL, categoryMap } from './utils/constants';
import { ensureElement } from './utils/utils';
import { IProduct, ICustomer } from './types';

// Инициализация
const events = new EventEmitter();
const api = new Api('https://larek-api.nomoreparties.co/api/weblarek');
const apiClient = new ApiClient(api);

// Модели
const productModel = new ProductModel(events);
const cartModel = new CartModel(events);
const customerModel = new CustomerModel(events);

// View (создаем один раз при загрузке страницы)
const catalogView = new CatalogView(ensureElement('.gallery'));
const headerView = new HeaderView(ensureElement('.header'), events);
const modalView = new ModalView(events);
const basketView = new BasketView(events);
const orderFormView = new OrderFormView(events);
const contactsFormView = new ContactsFormView(events);

// Обработчики событий

// Загрузка товаров
events.on('app:init', () => {
    apiClient.getProducts().then(products => {
        productModel.setProducts(products);
    });
});

// Отображение каталога
events.on('products:changed', (data: { products: IProduct[] }) => {
    const cards = data.products.map(product => {
        const card = new CatalogCardView(product.id, events);
        card.setTitle(product.title);
        card.setPrice(product.price);
        
        const categoryClass = categoryMap[product.category as keyof typeof categoryMap] || 'other';
        card.setCategory(product.category, categoryClass);
        
        const imageUrl = `${CDN_URL}/${product.image}`;
        card.setupImage(imageUrl, product.title);
        
        return card.render();
    });
    
    catalogView.setItems(cards);
});

// Выбор карточки товара
events.on('card:select', (data: { productId: string }) => {
    const product = productModel.getProductById(data.productId);
    if (product) {
        productModel.setSelectedProduct(product);
    }
});

// Показ детальной информации о товаре
events.on('product:selected', (data: { product: IProduct }) => {
    const inCart = cartModel.hasProduct(data.product.id);
    const preview = new PreviewCardView(data.product.id, events, inCart);
    
    preview.setTitle(data.product.title);
    preview.setPrice(data.product.price);
    
    const categoryClass = categoryMap[data.product.category as keyof typeof categoryMap] || 'other';
    preview.setCategory(data.product.category, categoryClass);
    
    const imageUrl = `${CDN_URL}/${data.product.image}`;
    preview.setupImage(imageUrl, data.product.title);
    
    preview.setDescription(data.product.description);
    preview.setButtonDisabled(!data.product.price); // Блокируем для бесценных товаров
    
    modalView.open(preview.render());
});

// Добавление товара в корзину
events.on('product:addToCart', (data: { productId: string }) => {
    const product = productModel.getProductById(data.productId);
    if (product && product.price !== null) {
        cartModel.addProduct(product);
        modalView.close();
    }
});

// Удаление товара из корзины
events.on('product:removeFromCart', (data: { productId: string }) => {
    cartModel.removeProduct(data.productId);
    modalView.close();
});

// Обновление счетчика в хедере
events.on('cart:changed', (data: { count: number }) => {
    headerView.setCounter(data.count);
});

// Открытие корзины
events.on('header:basketClick', () => {
    const items = cartModel.getCartItems();
    const total = cartModel.getTotalAmount();
    
    const basketCards = items.map((item, index) => {
        const card = new BasketCardView(item.id, index + 1, events);
        card.setTitle(item.title);
        card.setPrice(item.price);
        return card.render();
    });
    
    basketView.setItems(basketCards);
    basketView.setTotal(total);
    basketView.setCheckoutEnabled(items.length > 0);
    
    modalView.open(basketView.render());
});

// Удаление товара из корзины
events.on('basket:removeItem', (data: { productId: string }) => {
    cartModel.removeProduct(data.productId);
    // После удаления переоткрываем корзину для обновления
    const items = cartModel.getCartItems();
    if (items.length === 0) {
        modalView.close();
    } else {
        events.emit('header:basketClick');
    }
});

// Оформление заказа из корзины
events.on('basket:checkout', () => {
    // Сбрасываем данные формы перед открытием
    const customerData = customerModel.getCustomerData();
    orderFormView.setPayment(customerData.payment);
    orderFormView.setAddress(customerData.address);
    modalView.open(orderFormView.render());
});

// Обработка полей формы заказа
events.on('order:fieldChange', (data: { field: string; value: string }) => {
    const field = data.field as keyof ICustomer;
    customerModel.setData(field, data.value);
});

// Обработка ошибок формы заказа
events.on('customer:errors', (errors: Record<string, string>) => {
    orderFormView.setErrors(errors);
});

// Валидность формы заказа
events.on('order:valid', (data: { isValid: boolean }) => {
    orderFormView.setValid(data.isValid);
});

// Отправка формы заказа
events.on('order:submit', () => {
    if (customerModel.isOrderValid()) {
        // Сбрасываем данные формы контактов перед открытием
        const customerData = customerModel.getCustomerData();
        contactsFormView.setEmail(customerData.email);
        contactsFormView.setPhone(customerData.phone);
        modalView.open(contactsFormView.render());
    }
});

// Обработка полей формы контактов
events.on('contacts:fieldChange', (data: { field: string; value: string }) => {
    const field = data.field as keyof ICustomer;
    customerModel.setData(field, data.value);
});

// Обработка ошибок формы контактов
events.on('customer:errors', (data: { errors: Record<string, string> }) => {
    orderFormView.setErrors(data.errors);
    contactsFormView.setErrors(data.errors);
});

// Валидность формы контактов
events.on('contacts:valid', (data: { isValid: boolean }) => {
    contactsFormView.setValid(data.isValid);
});

// Отправка формы контактов и создание заказа
events.on('contacts:submit', async () => {
    if (customerModel.isContactsValid()) {
        try {
            const customerData = customerModel.getCustomerData();
            const cartItems = cartModel.getCartItems();
            
            if (cartItems.length === 0) {
                alert('Корзина пуста');
                return;
            }

            const orderData = {
                ...customerData,
                total: cartModel.getTotalAmount(),
                items: cartItems.map(item => item.id)
            };

            const response = await apiClient.createOrder(orderData);
            
            // Используем total из ответа сервера
            const successView = new SuccessView(response.total, events);
            modalView.open(successView.render());
            
            // Очищаем данные после успешного заказа
            cartModel.clearCart();
            customerModel.clearData();
            
        } catch (error) {
            console.error('Ошибка оформления заказа:', error);
            alert('Не удалось оформить заказ. Попробуйте еще раз.');
        }
    }
});

// Закрытие успешного заказа
events.on('success:close', () => {
    modalView.close();
});

// Запуск приложения
events.emit('app:init');