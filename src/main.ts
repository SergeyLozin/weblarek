import "./scss/styles.scss";
import { EventEmitter } from "./components/base/Events";
import { Api } from "./components/base/Api";
import { ProductModel } from "./components/models/ProductModel";
import { CartModel } from "./components/models/CartModel";
import { CustomerModel } from "./components/models/CustomerModel";
import { CatalogView } from "./components/base/CatalogView";
import { HeaderView } from "./components/base/HeaderView";
import { ModalView } from "./components/base/ModalView";
import { BasketView } from "./components/base/BasketView";
import { OrderFormView } from "./components/base/OrderFormView";
import { ContactsFormView } from "./components/base/ContactsFormView";
import { SuccessView } from "./components/base/SuccessView";
import { CatalogCardView } from "./components/base/CatalogCardView";
import { PreviewCardView } from "./components/base/PreviewCardView";
import { BasketCardView } from "./components/base/BasketCardView";
import { CDN_URL, categoryMap } from "./utils/constants";
import { IProduct, ProductsResponse, OrderRequest } from "./types";
import { apiProducts } from "./utils/data";

class ApiClient {
  constructor(private api: Api) {}

  async getProducts(): Promise<IProduct[]> {
    try {
      const response = await this.api.get<ProductsResponse>("/product/");
      return response.items;
    } catch (error) {
      console.error("Ошибка при получении товаров:", error);

      return apiProducts.items;
    }
  }

  async createOrder(orderData: OrderRequest): Promise<any> {
    try {
      const apiOrderData = {
        payment: orderData.payment === "card" ? "online" : "offline",
        email: orderData.email,
        phone: orderData.phone,
        address: orderData.address,
        total: orderData.total,
        items: orderData.items,
      };

      const response = await this.api.post("/order", apiOrderData, "POST");

      return response;
    } catch (error) {
      throw error;
    }
  }
}

class AppPresenter {
  constructor(
    private events: EventEmitter,
    private productModel: ProductModel,
    private cartModel: CartModel,
    private customerModel: CustomerModel,
    private apiClient: ApiClient,
    private catalogView: CatalogView,
    private headerView: HeaderView,
    private modalView: ModalView
  ) {
    this.initializeApp();
  }

  private initializeApp(): void {
    this.setupEventListeners();
    this.loadProducts();
  }

  private setupEventListeners(): void {
    this.events.on("products:changed", (data: { products: IProduct[] }) => {
      this.renderCatalog(data.products);
    });

    this.events.on("product:selected", (data: { product: IProduct }) => {
      if (data.product) {
        this.openProductPreview(data.product);
      }
    });

    this.events.on("cart:changed", (data: { count: number }) => {
      this.headerView.setCounter(data.count);
    });

    document.addEventListener("card:select", (event: Event) => {
      const customEvent = event as CustomEvent;

      if (customEvent.detail && customEvent.detail.productId) {
        const product = this.productModel.getProductById(
          customEvent.detail.productId
        );
        if (product) {
          this.productModel.setSelectedProduct(product);
        }
      } else {
        console.warn("нет productId");
      }
    });

    document.addEventListener("product:add-to-cart", (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail && customEvent.detail.productId) {
        console.log(
          "add-to-cart получено, productId:",
          customEvent.detail.productId
        );
        const product = this.productModel.getProductById(
          customEvent.detail.productId
        );
        if (product) {
          this.cartModel.addProduct(product);
          this.modalView.close();
        }
      } else {
        console.warn(" product:add-to-cart без productId");
      }
    });

    document.addEventListener("basket:remove-item", (event: Event) => {
      const customEvent = event as CustomEvent<{ productId: string }>;
      if (customEvent.detail && customEvent.detail.productId) {
        console.log(
          " basket:remove-item получено, productId:",
          customEvent.detail.productId
        );
        const product = this.cartModel
          .getCartItems()
          .find((item) => item.id === customEvent.detail.productId);
        if (product) {
          this.cartModel.removeProduct(product);

          this.openBasketModal();
        }
      } else {
        console.warn(" basket:remove-item без productId");
      }
    });

    // Нажатие кнопки открытия корзины
    document.addEventListener("header:basket-click", () => {
      this.openBasketModal();
    });

    // Нажатие кнопки оформления заказа
    document.addEventListener("basket:checkout", () => {
      this.openOrderForm();
    });

    // Нажатие кнопки перехода ко второй форме
    document.addEventListener("order:submit", () => {
      this.openContactsForm();
    });

    // Нажатие кнопки оплаты/завершения заказа

    // Изменение данных в формах
    document.addEventListener("payment:change", (event: Event) => {
      const customEvent = event as CustomEvent<{ method: string }>;
      this.customerModel.setPayment(
        customEvent.detail.method as "card" | "cash"
      );
    });

    document.addEventListener("address:change", () => {
      const orderFormView = new OrderFormView();
      const data = orderFormView.getData();
      this.customerModel.setAddress(data.address);
    });

    document.addEventListener("email:change", () => {
      const contactsFormView = new ContactsFormView();
      const data = contactsFormView.getData();
      this.customerModel.setEmail(data.email);
    });

    document.addEventListener("phone:change", () => {
      const contactsFormView = new ContactsFormView();
      const data = contactsFormView.getData();
      this.customerModel.setPhone(data.phone);
    });

    // Закрытие успешного заказа
    document.addEventListener("success:close", () => {
      this.modalView.close();
      this.cartModel.clearCart();
      this.customerModel.clearData();
    });
  }

  private async loadProducts(): Promise<void> {
    try {
      console.log("загружаем с API");
      const products = await this.apiClient.getProducts();
      console.log("Загружено:", products.length, "шт.");

      if (products.length === 0) {
        console.warn("пустой список");
      }

      this.productModel.setProducts(products);
    } catch (error) {
      console.error("ошибка при загрузке товаров:", error);
    }
  }
  private renderCatalog(products: IProduct[]): void {
    console.log("Рендер каталога:", products.length, "товаров");

    const cardViews = products.map((product) => {
      const cardView = new CatalogCardView();

      cardView.setTitle(product.title);
      cardView.setPrice(product.price);

      const categoryClass =
        categoryMap[product.category as keyof typeof categoryMap] || "other";
      cardView.setCategory(product.category, categoryClass);

      const imageUrl = `${CDN_URL}/${product.image}`;
      cardView.setupImage(imageUrl, product.title);

      const cardElement = cardView.render();
      cardElement.dataset.productId = product.id;

      return cardElement;
    });

    this.catalogView.setItems(cardViews);
    console.log(" рендер выполнен, карточек:", cardViews.length);
  }

  private openProductPreview(product: IProduct): void {
    const inCart = this.cartModel.hasProduct(product.id);
    const previewView = new PreviewCardView(product.id);

    previewView.setTitle(product.title);
    previewView.setPrice(product.price);

    const categoryClass =
      categoryMap[product.category as keyof typeof categoryMap] || "other";
    previewView.setCategory(product.category, categoryClass);

    const imageUrl = `${CDN_URL}/${product.image}`;
    previewView.setupImage(imageUrl, product.title);

    previewView.setDescription(product.description);
    previewView.setButtonText(inCart ? "Уже в корзине" : "В корзину");
    previewView.setButtonDisabled(inCart);

    const previewElement = previewView.render();
    previewElement.dataset.productId = product.id;

    this.modalView.open(previewElement);
  }

  private openBasketModal(): void {
    const items = this.cartModel.getCartItems();
    const total = this.cartModel.getTotalAmount();

    const cardViews = items.map((item, index) => {
      const cardView = new BasketCardView(item.id, index + 1);

      cardView.setTitle(item.title);
      cardView.setPrice(item.price);

      const cardElement = cardView.render();
      return cardElement;
    });

    const basketView = new BasketView(cardViews, total);
    const basketElement = basketView.render();

    // Обработка оформления заказа
    basketElement.addEventListener("basket:checkout", () => {
      this.openOrderForm();
    });

    this.modalView.open(basketElement);
  }

  private openOrderForm(): void {
    const customerData = this.customerModel.getCustomerData();
    console.log("Данные покупателя для формы заказа:", customerData);

    const orderFormView = new OrderFormView();
    orderFormView.setPayment(customerData.payment);
    orderFormView.setAddress(customerData.address);

    const orderElement = orderFormView.render();

    // Обработчик отправки формы заказа
    orderElement.addEventListener("form:submit", (event) => {
      event.preventDefault();
      console.log("Событие form:submit получено от OrderForm");

      const formData = orderFormView.getData();
      console.log(" Данные формы заказа:", formData);

      // Сохраняем данные в модель ПЕРЕД открытием следующей формы
      this.customerModel.setPayment(formData.payment as "card" | "cash");
      this.customerModel.setAddress(formData.address);

      console.log(
        "Данные сохранены в модель:",
        this.customerModel.getCustomerData()
      );

      this.openContactsForm();
    });

    this.modalView.open(orderElement);
    console.log("Форма заказа открыта");
  }

  private openContactsForm(): void {
    const customerData = this.customerModel.getCustomerData();
    const contactsFormView = new ContactsFormView();
    contactsFormView.setEmail(customerData.email);
    contactsFormView.setPhone(customerData.phone);

    const contactsElement = contactsFormView.render();

    // Обработчик отправки формы контактов
    contactsElement.addEventListener("contacts:submit", (event) => {
      event.preventDefault();
      console.log("форма отправлена");

      const formData = contactsFormView.getData();
      console.log("Данные контактов:", formData);

      // Сохраняем данные в модель
      this.customerModel.setEmail(formData.email);
      this.customerModel.setPhone(formData.phone);

      console.log(
        "Все данные покупателя:",
        this.customerModel.getCustomerData()
      );

      // Теперь обрабатываем заказ
      this.processOrder();
    });

    this.modalView.open(contactsElement);
    console.log("Форма контактов открыта");
  }

  private async processOrder(): Promise<void> {
    try {
      console.log("Начинаем обработку заказа...");

      // Получаем актуальные данные
      const customerData = this.customerModel.getCustomerData();
      const cartItems = this.cartModel.getCartItems();

      console.log("Данные покупателя:", customerData);
      console.log("Товары в корзине:", cartItems);

      // Проверяем, что все данные заполнены
      if (!customerData.email || !customerData.phone) {
        console.error("Email или телефон не заполнены");
        alert("Заполните email и телефон");
        return;
      }

      if (cartItems.length === 0) {
        console.error("Корзина пуста");
        alert("Корзина пуста");
        return;
      }

      // Собираем данные заказа
      const orderData: OrderRequest = {
        payment: customerData.payment,
        email: customerData.email,
        phone: customerData.phone,
        address: customerData.address,
        total: this.cartModel.getTotalAmount(),
        items: cartItems.map((item) => item.id),
      };

      console.log("Отправляем заказ:", orderData);

      // Отправляем на сервер
      await this.apiClient.createOrder(orderData);

      // Показываем успех
      const successView = new SuccessView(orderData.total);
      this.modalView.open(successView.render());

      // Очищаем данные
      this.cartModel.clearCart();
      this.customerModel.clearData();

      console.log("Заказ успешно оформлен");
    } catch (error) {
      console.error("Ошибка оформления заказа:", error);
      alert("Не удалось оформить заказ. ошибка.");
    }
  }
}

// ИНИЦИАЛИЗАЦИЯ ПРИЛОЖЕНИЯ
const events = new EventEmitter();
const api = new Api("https://larek-api.nomoreparties.co/api/weblarek");
const apiClient = new ApiClient(api);

// Модели
const productModel = new ProductModel(events);
const cartModel = new CartModel(events);
const customerModel = new CustomerModel(events);

// View
const catalogView = new CatalogView(document.querySelector(".gallery")!);
const headerView = new HeaderView(document.querySelector(".header")!);
const modalView = new ModalView();

// Презентер
new AppPresenter(
  events,
  productModel,
  cartModel,
  customerModel,
  apiClient,
  catalogView,
  headerView,
  modalView
);
