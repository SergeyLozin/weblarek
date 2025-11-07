# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/main.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```
# Интернет-магазин «Web-Larёk»
«Web-Larёk» — это интернет-магазин с товарами для веб-разработчиков, где пользователи могут просматривать товары, добавлять их в корзину и оформлять заказы. Сайт предоставляет удобный интерфейс с модальными окнами для просмотра деталей товаров, управления корзиной и выбора способа оплаты, обеспечивая полный цикл покупки с отправкой заказов на сервер.

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP (Model-View-Presenter), которая обеспечивает четкое разделение ответственности между классами слоев Model и View. Каждый слой несет свой смысл и ответственность:

Model - слой данных, отвечает за хранение и изменение данных.  
View - слой представления, отвечает за отображение данных на странице.  
Presenter - презентер содержит основную логику приложения и  отвечает за связь представления и данных.

Взаимодействие между классами обеспечивается использованием событийно-ориентированного подхода. Модели и Представления генерируют события при изменении данных или взаимодействии пользователя с приложением, а Презентер обрабатывает эти события используя методы как Моделей, так и Представлений.

### Базовый код

#### Класс Component
Является базовым классом для всех компонентов интерфейса.
Класс является дженериком и принимает в переменной `T` тип данных, которые могут быть переданы в метод `render` для отображения.

Конструктор:  
`constructor(container: HTMLElement)` - принимает ссылку на DOM элемент за отображение, которого он отвечает.

Поля класса:  
`container: HTMLElement` - поле для хранения корневого DOM элемента компонента.

Методы класса:  
`render(data?: Partial<T>): HTMLElement` - Главный метод класса. Он принимает данные, которые необходимо отобразить в интерфейсе, записывает эти данные в поля класса и возвращает ссылку на DOM-элемент. Предполагается, что в классах, которые будут наследоваться от `Component` будут реализованы сеттеры для полей с данными, которые будут вызываться в момент вызова `render` и записывать данные в необходимые DOM элементы.  
`setImage(element: HTMLImageElement, src: string, alt?: string): void` - утилитарный метод для модификации DOM-элементов `<img>`


#### Класс Api
Содержит в себе базовую логику отправки запросов.

Конструктор:  
`constructor(baseUrl: string, options: RequestInit = {})` - В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.

Поля класса:  
`baseUrl: string` - базовый адрес сервера  
`options: RequestInit` - объект с заголовками, которые будут использованы для запросов.

Методы:  
`get(uri: string): Promise<object>` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер  
`post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.  
`handleResponse(response: Response): Promise<object>` - защищенный метод проверяющий ответ сервера на корректность и возвращающий объект с данными полученный от сервера или отклоненный промис, в случае некорректных данных.

#### Класс EventEmitter
Брокер событий реализует паттерн "Наблюдатель", позволяющий отправлять события и подписываться на события, происходящие в системе. Класс используется для связи слоя данных и представления.

Конструктор класса не принимает параметров.

Поля класса:  
`_events: Map<string | RegExp, Set<Function>>)` -  хранит коллекцию подписок на события. Ключи коллекции - названия событий или регулярное выражение, значения - коллекция функций обработчиков, которые будут вызваны при срабатывании события.

Методы класса:  
`on<T extends object>(event: EventName, callback: (data: T) => void): void` - подписка на событие, принимает название события и функцию обработчик.  
`emit<T extends object>(event: string, data?: T): void` - инициализация события. При вызове события в метод передается название события и объект с данными, который будет использован как аргумент для вызова обработчика.  
`trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие с передачей в него данных из второго параметра.

### Данные
Интерфейсы 
`interface IProduct {
  id: string;           // Уникальный идентификатор товара
  title: string;        // Название товара
  image: string;        // URL изображения карточки
  category: string;     // Категория товара
  price: number | null; // Цена (цифра или null для "бесценных" товаров)
  description: string;  // Описание товара
}`

`interface ICustomer {
  payment: 'card' | 'cash'; // Способ оплаты
  address: string;          // Адрес доставки
  email: string;            // Email
  phone: string;            // Телефон
}`

### Модели данных

#### Класс ProductModel 
Хранит и управляет данными о товарах из каталога

Поля класса: 
`products: IProduct[], selectedProduct: IProduct | null` - каталог и выбранный товар

Методы класса: 

`setProducts(products: IProduct[]): void` — сохраняет массив товаров

`getProducts(): IProduct[]` — возвращает массив товаров

`setSelectedProduct(product: IProduct | null): void` — сохраняет выбранную карточку товара

`getSelectedProduct(): IProduct | null` — возвращает данные выбранного товара

`getProductById(id: string): IProduct | undefined` - получает товар по его айди

#### Класс CartModel
Управляет состоянием корзины

Поля класса: `items: IProduct[] = [];` - массив товаров в корзине

Методы класса:

`addProduct(product: IProduct): void` — добавляет товар в корзину 

`removeProduct(product: IProduct): void` — удаляет товар из корзины 

`getCartItems(): IProduct[]` — возвращает список товаров в корзине

`getTotalAmount(): number ` — вычисляет и возвращает общую стоимость товаров

`getItemsCount(): number `— возвращает общее количество товаров в корзине (счетчик)

`hasProduct(id: string): boolean` — проверяет доступное наличие товара по его фйди

`clearCart(): void` - очистка корзины

#### Каласс CustomerModel 
Хранение создание  и валидация данных покупателя

Поля класса: `data: ICustomer = []`

Методы класса:

`setCustomerData(data: ICustomer): void`  — сохраняет данные покупателя

`getCustomerData(): ICustomer` — возвращает данные покупателя

`validateData(): boolean` — проверяет корректность данных в полях. Проверяет либо просто валидность всех полей, либо детально по каждому полю

`clearData(): void` - очистка данных покупателя

`setPayment(payment: 'card' | 'cash'): void` - присваивает переданное значение полю payment

`setEmail(email: string): void` - присваивает переданное значение полю email

`setPhone(phone: string): void` - присваивает переданное значение полю phone

`setAddress(address: string): void` - присваивает переданное значение полю adress

### Слой Коммуникации

#### Класс ApiClient
Выполняет запрос на сервер с помощью метода get класса Api и будет получать с сервера объект с массивом товаров

Поля класса: `api: IApi`

Методы класса:

`getProducts(): Promise<IProduct[]>` - делает get запрос на эндпоинт /product/ и возвращает массив товаров

`createOrder(orderData: IOrderRequest): Promise<IOrderResponse> ` - делает post запрос на эндпоинт /order/ и передаёт в него данные, полученные в параметрах метода.

### слой View
Слой View отвечает за отображение данных и взаимодействие с пользователем. Все компоненты наследуются от базового класса Component


#### Класс FormView
Абстрактный базовый класс для всех форм с валидацией.

Конструктор:
`constructor(container: HTMLFormElement)` - принимает ссылку на DOM-элемент формы

Поля класса:
`_submitButton: HTMLButtonElement` - кнопка отправки формы
`_errors: HTMLElement` - элемент для отображения ошибок

Методы класса:
`setErrors(message: string): void` - устанавливает сообщение об ошибках
`clearErrors(): void` - очищает сообщения об ошибках
`setValid(valid: boolean): void` - устанавливает состояние валидности формы (активирует/деактивирует кнопку)
`getData(): any` - абстрактный метод, возвращает данные формы

#### Класс CardView

Базовый класс для карточек товаров.

Конструктор:
`constructor(container: HTMLElement)` - принимает ссылку на DOM-элемент карточки

Поля класса:
`_title: HTMLElement` - элемент заголовка товара
`_price: HTMLElement `- элемент цены товара
`_category: HTMLElement` - элемент категории товара
`_image: HTMLImageElement` - элемент изображения товара

Методы класса:
`setTitle(title: string): void`- устанавливает заголовок карточки
`setPrice(price: number | null): void`- устанавливает цену товара (или "Бесценно" для null)
`setCategory(category: string, categoryClass: string): void` - устанавливает категорию товара и CSS-класс
`setupImage(src: string, alt: string): void` - устанавливает изображение товара


#### Класс CatalogView

Отображает каталог товаров.

Конструктор:
`constructor(container: HTMLElement)` - принимает контейнер для размещения каталога

Методы класса:
`setItems(items: HTMLElement[]): void` - отображает массив карточек товаров в каталоге

#### Класс CatalogCardView

Карточка товара в каталоге. Наследуется от CardView.

Конструктор:
`constructor()` - создает карточку из шаблона card-catalog

Генерируемые события:
`card:select` - при клике на карточку, содержит productId в event.detail

#### Класс PreviewCardView

Детальная карточка товара в модальном окне. Наследуется от C`ardView`.

Конструктор:
`constructor(productId: string)` - создает карточку из шаблона `card-preview`

Методы класса:
`setDescription(description: string): void` - устанавливает описание товара
`setButtonText(text: string): void` - устанавливает текст кнопки
`setButtonDisabled(disabled: boolean): void` - блокирует/разблокирует кнопку

Генерируемые события:
`product:add-to-cart `- при нажатии кнопки "В корзину", содержит `productId `в `event.detail`

#### Класс BasketCardView

Элемент товара в корзине покупок. Наследуется от `CardView`.

Конструктор:
`constructor(productId: string, index: number)` - создает элемент из шаблона `card-basket`

Методы класса:
`setTitle(title: string): void `- устанавливает название товара
`setPrice(price: number | null): void` - устанавливает цену товара

Генерируемые события:
`basket:remove-item `- при нажатии кнопки удаления, содержит `productId` в `event.detail`

#### Класс BasketView

Представление корзины покупок.

Конструктор:
`constructor(items: HTMLElement[], total: number)` - создает корзину из шаблона basket

Генерируемые события:
`basket:checkout` - при нажатии кнопки "Оформить"

#### Класс HeaderView

Представление шапки приложения.

Конструктор:
`constructor(container: HTMLElement)` - принимает DOM-элемент шапки

Методы класса:
`setCounter(value: number): void `- обновляет счетчик товаров в корзине

Генерируемые события:
`header:basket-click` - при клике на иконку корзины

#### Класс ModalView

Управление модальными окнами.

Конструктор:
`constructor()` - использует DOM-элемент `modal-container`

Методы класса:
`open(content: HTMLElement): void` - открывает модальное окно с переданным контентом
`close(): void` - закрывает модальное окно

Генерируемые события:
`modal:close` - при закрытии модального окна


#### Класс OrderFormView

Форма ввода адреса и выбора способа оплаты. Наследуется от FormView.

Конструктор:
`constructor()` - создает форму из шаблона order

Методы класса:
`setPayment(method: string): void `- устанавливает способ оплаты ('card' или 'cash')
`setAddress(address: string): void` - устанавливает адрес доставки
`getData(): {payment: string, address: string}` - возвращает данные формы

Генерируемые события:
`payment:change` - при изменении способа оплаты
`address:change` - при изменении адреса доставки
`form:submit` - при отправке формы (только при валидных данных)

#### Класс ContactsFormView

Форма ввода контактных данных. Наследуется от FormView.

Конструктор:
`constructor()` - создает форму из шаблона contacts

Методы класса:
`setEmail(email: string): void` - устанавливает email
`setPhone(phone: string): void` - устанавливает телефон
`getData(): {email: string, phone: string}` - возвращает данные формы

Генерируемые события:
`email:change` - при изменении email
`phone:change` - при изменении телефона
`contacts:submit` - при отправке формы (только при валидных данных)

#### Класс SuccessView

Сообщение об успешном оформлении заказа.

Конструктор:
`constructor(total: number)` - создает сообщение из шаблона success

Генерируемые события:
`success:close` - при закрытии сообщения

Взаимодействие компонентов View

Компоненты View генерируют события при взаимодействии пользователя:

Действия с товарами: `card:select, product:add-to-cart, basket:remove-item`
Навигация: `header:basket-click, basket:checkout`
Работа с формами: `form:submit, payment:change, address:change, email:change, phone:change, contacts:submit`
Управление UI: `modal:close, success:close`


## Слой Presenter

Презентер содержит основную бизнес-логику приложения и отвечает за координацию взаимодействия между слоями Model и View. Он обрабатывает события от View, обновляет Model и управляет состоянием приложения.

### Класс AppPresenter

Главный презентер приложения, который связывает все компоненты и управляет потоком данных.

**Конструктор:**  
`constructor(events: EventEmitter, productModel: ProductModel, cartModel: CartModel, customerModel: CustomerModel, apiClient: ApiClient, catalogView: CatalogView, headerView: HeaderView, modalView: ModalView)` - принимает все необходимые зависимости для работы приложения

**Методы класса:**

#### Инициализация
`private initializeApp(): void` - инициализирует приложение, настраивает обработчики событий и загружает товары

`private setupEventListeners(): void` - настраивает все обработчики событий от Model и View

`private setupCustomEventListeners(): void` - настраивает обработчики кастомных событий от View компонентов

#### Работа с данными
`private async loadProducts(): Promise<void>` - загружает товары с сервера через ApiClient и сохраняет в ProductModel

`private renderCatalog(products: IProduct[]): void` - отображает каталог товаров, создавая карточки для каждого товара

#### Управление модальными окнами
`private openProductPreview(product: IProduct): void` - открывает модальное окно с детальной информацией о товаре

`private openBasketModal(): void` - открывает модальное окно корзины с текущими товарами

`private openOrderForm(): void` - открывает форму заказа (адрес и способ оплаты)

`private openContactsForm(): void` - открывает форму контактов (email и телефон)

#### Обработка заказа
`private async processOrder(): Promise<void>` - основной метод обработки заказа, который:
- Собирает данные из CustomerModel и CartModel
- Отправляет заказ на сервер через ApiClient
- Показывает сообщение об успехе
- Очищает корзину и данные покупателя

**Обрабатываемые события:**

#### События от Model
- `products:changed` - при изменении списка товаров, вызывает `renderCatalog()`
- `product:selected` - при выборе товара, вызывает `openProductPreview()`
- `cart:changed` - при изменении корзины, обновляет счетчик в HeaderView

#### События от View
- `card:select` - при клике на карточку товара, устанавливает выбранный товар в ProductModel
- `product:add-to-cart` - при добавлении товара в корзину, обновляет CartModel
- `basket:remove-item` - при удалении товара из корзины, обновляет CartModel
- `header:basket-click` - при клике на корзину, открывает модальное окно корзины
- `basket:checkout` - при оформлении заказа из корзины, открывает форму заказа
- `form:submit` - при отправке формы заказа, открывает форму контактов
- `contacts:submit` - при отправке формы контактов, обрабатывает заказ
- `payment:change`, `address:change`, `email:change`, `phone:change` - при изменении данных форм, обновляет CustomerModel
- `success:close` - при закрытии сообщения об успехе, закрывает модальное окно

### Класс ApiClient

Клиент для работы с API, инкапсулирующий логику HTTP-запросов.

**Конструктор:**  
`constructor(api: Api)` - принимает экземпляр класса Api для выполнения запросов

**Методы класса:**

`async getProducts(): Promise<IProduct[]>` - получает список товаров с сервера, возвращает массив товаров или fallback-данные при ошибке

`async createOrder(orderData: OrderRequest): Promise<any>` - отправляет заказ на сервер, преобразуя данные в формат, ожидаемый API






