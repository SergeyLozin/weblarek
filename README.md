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
- `products: IProduct[]` - массив товаров
- `selectedProduct: IProduct | null` - выбранный товар

Методы класса:
- `setProducts(products: IProduct[]): void` - сохраняет массив товаров
- `getProducts(): IProduct[]` - возвращает массив товаров
- `setSelectedProduct(product: IProduct): void` - сохраняет выбранный товар
- `getSelectedProduct(): IProduct | null` - возвращает выбранный товар
- `getProductById(id: string): IProduct | undefined` - находит товар по ID

Генерируемые события:
- `products:changed` - при изменении списка товаров
- `product:selected` - при выборе товара

#### Класс CartModel
Управляет состоянием корзины

Поля класса:
- `items: IProduct[]` - товары в корзине

**Методы класса:**
- `addProduct(product: IProduct): void` - добавляет товар в корзину
- `removeProduct(productId: string): void` - удаляет товар из корзины по ID
- `clearCart(): void` - очищает корзину
- `getCartItems(): IProduct[]` - возвращает список товаров
- `getTotalAmount(): number` - вычисляет общую стоимость
- `getItemsCount(): number` - возвращает количество товаров
- `hasProduct(id: string): boolean` - проверяет наличие товара

Генерируемые события:
- `cart:changed` - при любом изменении корзины (передает `{items, total, count}`)

#### Класс CustomerModel 
Хранение, создание и валидация данных покупателя

Поля класса:
- `data: ICustomer` - данные покупателя

Методы класса:
- `setData(key: keyof ICustomer, value: string): void` - устанавливает значение поля
- `getCustomerData(): ICustomer` - возвращает данные покупателя
- `clearData(): void` - очищает данные
- `isOrderValid(): boolean` - проверяет валидность данных для заказа
- `isContactsValid(): boolean` - проверяет валидность контактных данных

Генерируемые события:
- `customer:errors` - передает объект с ошибками валидации
- `order:valid` - указывает валидность формы заказа
- `contacts:valid` - указывает валидность формы контактов
- `customer:cleared` - при очистке данных

### Слой View

#### Класс FormView

Абстрактный базовый класс для всех форм.

Конструктор:
`constructor(container: HTMLElement, events: EventEmitter)`

Методы класса:
- `setErrors(errors: Record<string, string>): void` - отображает ошибки
- `clearErrors(): void` - очищает ошибки
- `setValid(valid: boolean): void` - управляет состоянием кнопки отправки
- `getData(): any` - абстрактный метод получения данных


#### Класс CardView

Базовый класс для всех типов карточек товаров.

Конструктор:
`constructor(container: HTMLElement, productId: string, events: EventEmitter)`

Поля класса:
- `productId: string` - ID товара
- `_title: HTMLElement` - элемент заголовка
- `_price: HTMLElement` - элемент цены
- `_category: HTMLElement | null` - элемент категории (опционально)
- `_image: HTMLImageElement | null` - элемент изображения (опционально)

Методы класса:
- `setTitle(title: string): void` - устанавливает заголовок
- `setPrice(price: number | null): void` - устанавливает цену
- `setCategory(category: string, categoryClass: string): void` - устанавливает категорию (если элемент существует)
- `setupImage(src: string, alt: string): void` - устанавливает изображение (если элемент существует)


#### Класс CatalogView

Отображает каталог товаров.

Конструктор:
`constructor(container: HTMLElement)`

Методы класса:
- `setItems(items: HTMLElement[]): void` - отображает массив карточек

#### Класс CatalogCardView

Карточка товара в каталоге. Наследуется от CardView.

Конструктор:
`constructor(productId: string, events: EventEmitter)`

Генерируемые события:
- `card:select` - при клике на карточку

#### Класс PreviewCardView

Детальная карточка товара в модальном окне. Наследуется от CardView.

Конструктор:
`constructor(events: EventEmitter)` - создается один раз при загрузке страницы

Методы класса:
- `setDescription(description: string): void` - устанавливает описание
- `setButtonText(text: string): void` - устанавливает текст кнопки
- `setButtonDisabled(disabled: boolean): void` - блокирует кнопку
- `updateButtonState(inCart: boolean): void` - обновляет состояние кнопки

Генерируемые события:
- `cart:toggle` - при нажатии на кнопку корзины


#### Класс BasketCardView

Элемент товара в корзине. Наследуется от CardView.

Конструктор:
`constructor(productId: string, index: number, events: EventEmitter)`

Генерируемые события:
- `basket:removeItem` - при удалении товара из корзины

#### Класс BasketView

Представление корзины покупок. Автоматически обновляет отображение при изменении данных корзины.

Конструктор:
`constructor(events: EventEmitter)`

Методы класса:
- `render(): HTMLElement` - возвращает корневой элемент корзины с актуальными данными

Внутренние методы:
- `updateView(): void` - обновляет отображение корзины на основе текущих данных

Генерируемые события:
- `basket:checkout` - при нажатии кнопки оформления





#### Класс HeaderView

Шапка приложения.

Конструктор:
`constructor(container: HTMLElement, events: EventEmitter)`

Методы класса:
- `setCounter(value: number): void` - обновляет счетчик корзины

Генерируемые события:
- `header:basketClick` - при клике на иконку корзины

#### Класс ModalView

Управление модальными окнами.

Конструктор:
`constructor(events: EventEmitter)`

Методы класса:
- `open(content: HTMLElement): void` - открывает модальное окно
- `close(): void` - закрывает модальное окно
- `isOpen(): boolean` - проверяет открыто ли модальное окно

Генерируемые события:
- `modal:open` - при открытии модального окна
- `modal:close` - при закрытии модального окна

#### Класс OrderFormView

Форма ввода адреса и способа оплаты. Наследуется от FormView.

Конструктор:
`constructor(events: EventEmitter)`

Методы класса:
- `setPayment(method: string): void` - устанавливает способ оплаты
- `setAddress(address: string): void` - устанавливает адрес

Генерируемые события:
- `order:submit` - при отправке формы

#### Класс ContactsFormView

Форма ввода контактных данных. Наследуется от FormView.

Конструктор:
`constructor(events: EventEmitter)`

Методы класса:
- `setEmail(email: string): void` - устанавливает email
- `setPhone(phone: string): void` - устанавливает телефон

Генерируемые события:
- `contacts:submit` - при отправке формы

#### Класс SuccessView

Сообщение об успешном оформлении заказа.

Конструктор:
`constructor(events: EventEmitter)` - создается один раз при загрузке страницы

Методы класса:
- `setTotal(total: number): void` - устанавливает сумму заказа

Генерируемые события:
- `success:close` - при закрытии сообщения

#### Класс ApiClient

Клиент для работы с API сервером.

Конструктор:
`constructor(api: Api)`

Методы класса:
- `getProducts(): Promise<IProduct[]>` - получает список товаров
- `createOrder(orderData: OrderRequest): Promise<OrderResponse>` - создает заказ

### Слой Presenter

Реализация в main.ts

Презентер реализован как набор обработчиков событий в файле main.ts, который координирует взаимодействие между Model и View.

Основные обработчики:
- Загрузка товаров происходит напрямую при инициализации приложения
- `products:changed` - отображение каталога
- `card:select` - выбор товара
- `product:selected` - показ детальной информации
- `cart:toggle` - переключение состояния товара в корзине
- `cart:changed` - обновление UI корзины и счетчика
- `header:basketClick` - открытие корзины
- `basket:removeItem` - удаление товара из корзины
- `basket:checkout` - переход к оформлению заказа
- `form:fieldChange` - общая обработка ввода данных во всех формах
- `customer:errors` - отображение ошибок валидации
- `order:valid / contacts:valid` - управление состоянием кнопок
- `order:submit / contacts:submit` - обработка отправки форм
- `success:close` - завершение заказа

