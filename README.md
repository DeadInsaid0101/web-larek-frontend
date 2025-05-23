# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
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

Архитектура проекта

Архитектура построена по принципам модульности и ООП. Компоненты разделены по зонам ответственности, используются паттерны Controller и Dependency Injection.

Основные модули:

Api — класс для работы с сервером
Класс Api обеспечивает взаимодействие приложения с внешним API-сервером. Он инкапсулирует логику выполнения HTTP-запросов и обработки ответов.
Обрабатывает ответы от сервера и преобразует их в формат JSON.

Параметры конструктора:
 - baseUrl: string — базовый адрес API, к которому будут добавляться относительные пути.
 - options: RequestInit — дополнительные настройки запроса. Значения по умолчанию включают Content-Type: application/json.

Методы:
 - get(url: string): Promise<any> - выполняет GET-запрос по заданному URI и возвращает распарсенный JSON-ответ.
 - post(url: string, data: unknown, method?: string): Promise<any> - выполняет POST, PUT или DELETE-запрос с телом data в формате JSON.
 - handleResponse(response: Response): Promise<any> - преобразует ответ сервера в JSON. Если ответ неуспешен, выбрасывает ошибку с текстом ошибки из тела ответа или response.statusText.





Класс EventEmitter — обеспечивает работу событий. Его функции: возможность установить и снять слушателей событий, вызвать слушателей при возникновении события.

Поля:
 - _events: Map<EventName, Set<Subscriber>> — хранилище событий.

Методы:
 - on(event: string | RegExp, callback: (...args: any[]) => void): void - добавляет обработчик к событию. Поддерживает строки и регулярные выражения как имена событий.
 - off(event: string | RegExp, callback: (...args: any[]) => void): void - удаляет обработчик события. Если обработчиков не осталось, событие удаляется из хранилища.
 - emit(event: string, ...args: unknown[]): void - инициирует событие.
 - onAll(callback: (...args: any[]) => void): void - подписывает обработчик на все события. Используется для отладки или логирования.
 - offAll(callback: (...args: any[]) => void): void - удаляет все подписки на все события.
 - trigger(event: string, context?: unknown): (...args: unknown[]) => void - возвращает функцию, которая при вызове объединяет переданные ей данные и инициирует событие.




LarekApi — класс для взаимодействия с сервером.
Класс LarekApi наследуется от базового класса Api и реализует конкретные методы для работы с данными интернет-магазина: получение списка товаров и отправка заказа. Основные функции:
Получение списка товаров с сервера.
Отправка заказа на сервер.

Поля:
 - url: string — базовый URL для загрузки изображений или других статичных ресурсов. Передаётся при создании экземпляра класса.

Методы:
 - getProductList(): Promise<IProductItem[]> - выполняет GET-запрос. Возвращает список товаров в виде массива объектов IProductItem.
 - orderProducts(order: IOrder): Promise<IOrderResult> - выполняет POST-запрос. Возвращает результат выполнения заказа IOrderResult.




Класс: AppController - управляет основным потоком приложения. Он инициализирует все компоненты, связывает между собой модули, обрабатывает события, полученные от EventEmitter, и управляет переходами между модальными окнами.

Поля:
 - api: LarekApi — экземпляр API-клиента для работы с сервером.
 - events: EventEmitter — глобальный объект событий.
 - productList: ProductList — отвечает за отображение всех карточек товаров.
 - cartCounter: CartCounter — отображает количество товаров в корзине.
 - modal: Modal — универсальный класс для модальных окон.
 - productModal: ProductModal — отображение карточки товара в модальном окне.
 - basketModal: BasketModal — модальное окно корзины.
 - orderAdressModal: OrderAdressModal — модальное окно выбора оплаты и адреса доставки.
 - orderContactsModal: OrderContactsModal — модальное окно ввода контактов.
 - orderSuccessModal: OrderSuccessModal — окно успешного оформления заказа.

Методы:
 - constructor(api: LarekApi) — инициализирует зависимости и подписывает обработчики событий.
 - init(): void — основной метод запуска приложения:
    - Загружает список товаров с сервера.
    - Создаёт экземпляры всех классов.
    - Подписывает события.

 - handleCardClick(product: IProductItem): void — открывает ProductModal по клику на карточку.
 - handleAddToCart(product: IProductItem): void — добавляет товар в корзину и обновляет счетчик.
 - handleOpenBasket(): void — открывает корзину.
 - handleOrderSubmit(order: IOrder): void —  открывает OrderSuccessModal.
 - handleNavigation(eventName: string): void — управляет переходами между модальными окнами.






Класс ProductCard - отвечает за отображение одной карточки товара в интерфейсе и обработку связанных с ней событий. Создает и возвращает DOM-элемент карточки товара. Отображает основные данные. Реагирует на действия пользователя через EventEmitter.

Поля:
 - data: IProductItem - данные одного товара.
 - element: HTMLElement - DOM-элемент карточки.
 - events: IEvents - Объект для генерации и обработки событий.

Методы:
 - constructor(data: IProductItem, events: IEvents) - инициализация карточки: сохраняет данные, рендерит DOM, назначает обработчики.
 - render(): HTMLElement - создает и возвращает DOM-элемент карточки.
 - getElement(): HTMLElement - возвращает уже созданный DOM-элемент.
 - bindEvents(): void - назначает обработчики событий.




Класс ProductList отвечает за управление и отображение карточек товаров на странице. Он получает массив товаров, создает для каждого товара экземпляр ProductCard.

Основные функции:
Использует ProductCard для создания и управления каждой карточкой.
Использует EventEmitter для подписки на события карточек и передачи их данных.
Связан с контроллером приложения AppController, который управляет загрузкой данных.

Поля:
 - items: IProductItem[] - массив данных товаров.
 - cards: ProductCard[] - коллекция экземпляров карточек товаров.
 - container: HTMLElement - DOM-элемент, контейнер для карточек товаров.
 - events: IEvents - Обработчик событий EventEmitter.

Методы:
 - constructor(container: HTMLElement, events: IEvents) - инициализирует контейнер и обработчик событий.
 - setItems(items: IProductItem[]): void - устанавливает список товаров, создает карточки и рендерит их.
 - render(): void - отрисовывает все карточки в контейнере.
 - bindEvents(): void - подписывается на события всех карточек.




Класс CartCounter управляет визуальным отображением количества товаров в корзине.

Основные функции:
Отображает текущее количество товаров.
Обновляет счетчик при изменении количества.
Подписывается на событие добавление в корзину или удаление через EventEmitter.

Поля:
 - container: HTMLElement - DOM-элемент для отображения счётчика товаров.
 - events: EventEmitter - ссылка на EventEmitter.
 - count: number - число товаров в корзине.

Методы:
 - render(): void - обновляет DOM-элемент с новым числом.
 - setCount(count: number): void - устанавливает новое значение и вызывает render.
 - listen(): void - подписка на события корзины.




Класс Modal управляет отображением модального окна на странице. Он обеспечивает способы открытия, закрытия и динамической подмены содержимого модального окна, независимо от типа отображаемого контента.

Поля:
 - modalElement: HTMLElement — корневой элемент модального окна в DOM.
 - containerElement: HTMLElement — внутренний контейнер для контента, куда вставляется конкретный контент.
 - closeButton: HTMLElement — кнопка закрытия модального окна.
 - isActive: boolean — указывает, открыта ли модалка.

Методы:
 - constructor(modalElement: HTMLElement) - инициализирует поля, находит элементы DOM и назначает обработчик клика на кнопку закрытия.
 - open(): void - отображает модальное окно.
 - close(): void - скрывает модальное окно, очищает содержимое контейнера.
 - render(content: HTMLElement): void - позволяет обновить содержимое модального окна.




Класс ProductModal — отвечает за работу модального окна карточки товара.

Поля:
 - modal: Modal — экземпляр базового класса Modal
 - product: IProductItem — данные о товаре
 - eventEmitter: EventEmitter — для отправки события о добавлении товара в корзину
 - addToCartButton: HTMLButtonElement — кнопка «Купить» внутри модального окна

Методы:
 - constructor(product: IProductItem, eventEmitter?: EventEmitter)
 - render(): void — рендерит содержимое модального окна с данными товара, вставляет разметку, находит кнопку и вешает слушатель
 - addToCart(): void — обработчик клика на кнопку добавления в корзину




Класс BasketModal — отвечает за работу модального окна корзины.

Поля:
 - modal: Modal — экземпляр базового класса Modal
 - items: IProductItem[] — массив товаров, которые находятся в корзине
 - containerElement: HTMLElement — элемент DOM, куда рендерится список товаров
 - totalPriceElement: HTMLElement — элемент DOM для отображения общей суммы добавленных товаров
 - orderButton: HTMLButtonElement — кнопка оформления заказа
 - deleteButton: HTMLButtonElement — удаление товара из корзины

Методы:
 - constructor(modal: Modal)
 - addItem(item: IProductItem): void — добавляет товар в корзину, обновляет интерфейс и сумму
 - removeItem(itemId: string): void — удаляет товар
 - render(): void — отрисовывает текущий список товаров и сумму
 - deleteClick(event: Event): void — обработчик клика на кнопку удаления товара
 - orderClick(event: Event): void — обработчик клика на кнопку оформления заказа




Класс OrderAdressModal управляет модальным окном оформления адреса доставки и способа оплаты.

Поля:
 - modal: Modal — экземпляр модального окна.
 - paymentButtons: HTMLButtonElement — кнопки выбора способа оплаты.
 - addressInput: HTMLInputElement — поле ввода адреса доставки.
 - submitButton: HTMLButtonElement — кнопка «Далее».
 - eventEmitter: IEvents — объект для отправки события перехода к следующему шагу.

Методы:
 - constructor(modal: Modal, eventEmitter: IEvents) — инициализирует класс, находит DOM-элементы, вешает обработчики событий.
 - render(): void — рендерит содержимое модального окна.
 - validate(): void — проверяет валидность полей.
 - handleSubmit(): void — обработчик клика на кнопку «Далее».






Класс OrderContactsModal - отвечает за работу модального окна ввода контактной информации пользователя.

Поля:
 - modal: Modal — экземпляр базового класса модального окна.
 - formElement: HTMLFormElement — форма, содержащая поля ввода.
 - emailInput: HTMLInputElement — поле ввода email.
 - phoneInput: HTMLInputElement — поле ввода телефона.
 - submitButton: HTMLButtonElement — кнопка «Оплатить».
 - eventEmitter: IEvents — объект для отправки события оформления заказа.

Методы:
 - constructor(modal: Modal, eventEmitter: IEvents) — инициализирует объект, сохраняет ссылки на DOM-элементы, вешает обработчики событий.
 - render(): void — рендерит содержимое модального окна, создаёт разметку формы, инициализирует DOM-элементы.
 - validate(): void — проверяет валидность полей.
 - handleSubmit(): void — обработчик клика на кнопку «Оплатить».




Класс OrderSuccessModal - управляет модальным окном с сообщением об успешном оформлении заказа. Показывает итоговую сумму списанных средств и после закрытия инициирует очистку корзины.

Поля:
 - modal: Modal — экземпляр модального окна.
 - closeButton: HTMLButtonElement — кнопка закрытия.
 - sumElement: HTMLElement — элемент для отображения суммы заказа.
 - eventEmitter: IEvents —  используется для очистки корзины.

Методы:
 - constructor(modal: Modal, eventEmitter: IEvents) — инициализирует модальное окно, находит элементы, назначает обработчик.
 - render(total: number): void — отображает сумму заказа и показывает модальное окно.
 - handleClose(): void — обрабатывает клик на кнопку, закрывает модальное окно и отчищает корзину.