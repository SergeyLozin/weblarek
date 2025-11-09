
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
const previewCardView = new PreviewCardView(events);
const successView = new SuccessView(events); // Создаем один раз

// Загрузка товаров при инициализации приложения
apiClient.getProducts()
    .then(products => {
        productModel.setProducts(products);
    })
    .catch(error => {
        console.error('Ошибка при загрузке товаров:', error);
        alert('Не удалось загрузить товары. Пожалуйста, обновите страницу.');
    });

// Отображение каталога
events.on('products:changed', (data: { products: IProduct[] }) => {
    const cards = data.products.map(product => {
        const card = new CatalogCardView(product.id, events);
        card.setTitle(product.title);
        card.setPrice(product.price);
        
        const categoryClass = categoryMap[product.category as keyof typeof categoryMap] || 'other';
        card.setCategory(product.category, categoryClass);
        
        // Исправляем формирование URL изображения
        const imageUrl = `${CDN_URL}${product.image}`;
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
    
    previewCardView.productId = data.product.id;
    previewCardView.setTitle(data.product.title);
    previewCardView.setPrice(data.product.price);
    
    const categoryClass = categoryMap[data.product.category as keyof typeof categoryMap] || 'other';
    previewCardView.setCategory(data.product.category, categoryClass);
    
    const imageUrl = `${CDN_URL}${data.product.image}`;
    previewCardView.setupImage(imageUrl, data.product.title);
    
    previewCardView.setDescription(data.product.description);
    
    // Блокируем кнопку если товар без цены и меняем текст
    if (data.product.price === null) {
        previewCardView.setButtonText('Недоступно');
        previewCardView.setButtonDisabled(true);
    } else {
        // Обновляем текст кнопки в зависимости от состояния корзины
        previewCardView.updateButtonState(inCart);
    }
    
    modalView.open(previewCardView.render());
});



// Открытие корзины
events.on('header:basketClick', () => {
    const items = cartModel.getCartItems();
    const total = cartModel.getTotalAmount();
    basketView.update(items, total);
    modalView.open(basketView.render());
});

// Обновление состояния при изменении корзины
events.on('cart:changed', (data: { count: number; items: IProduct[]; total: number }) => {
    // Обновляем счетчик в хедере
    headerView.setCounter(data.count);
    
    // Если корзина открыта, обновляем ее данные
    if (modalView.isOpen()) {
        basketView.update(data.items, data.total);
    }
});

// Переключение товара в корзине из окна деталей
events.on('cart:toggle', (data: { productId: string }) => {
    const product = productModel.getProductById(data.productId);
    if (product) {
        if (cartModel.hasProduct(data.productId)) {
            cartModel.removeProduct(data.productId);
        } else {
            // Проверяем, что товар имеет цену
            if (product.price !== null) {
                cartModel.addProduct(product);
            }
        }
        modalView.close();
    }
});

// Удаление товара из корзины
events.on('basket:removeItem', (data: { productId: string }) => {
    cartModel.removeProduct(data.productId);
    // Все остальное автоматически обработается через событие cart:changed
});

// Оформление заказа из корзины
events.on('basket:checkout', () => {
    // Сбрасываем данные формы перед открытием
    const customerData = customerModel.getCustomerData();
    orderFormView.setPayment(customerData.payment);
    orderFormView.setAddress(customerData.address);
    modalView.open(orderFormView.render());
});

// Обработка полей всех форм
events.on('form:fieldChange', (data: { field: string; value: string }) => {
    const field = data.field as keyof ICustomer;
    customerModel.setData(field, data.value);
});

// Обработка ошибок формы заказа
events.on('customer:errors', (data: { errors: Record<string, string> }) => {
    orderFormView.setErrors(data.errors);
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



// Обработка ошибок формы контактов
events.on('customer:errors', (data: { errors: Record<string, string> }) => {
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
            
            // Обновляем сумму в successView и открываем модальное окно
            successView.setTotal(response.total);
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