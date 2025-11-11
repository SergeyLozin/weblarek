import { Component } from "../base/Component";
import { EventEmitter } from "../base/Events";
import { ensureElement } from "../../utils/utils";
import { IProduct } from "../../types";
import { BasketCardView } from "./BasketCardView";


export class BasketView extends Component<HTMLElement> {
    private _list: HTMLElement;
    private _total: HTMLElement;
    private _checkoutButton: HTMLButtonElement;
    private items: IProduct[] = [];
    private total: number = 0;

    constructor(private events: EventEmitter) {
        const template = document.getElementById('basket') as HTMLTemplateElement;
        const container = template.content.cloneNode(true) as DocumentFragment;
        const element = container.firstElementChild as HTMLElement;
        super(element);

        this._list = ensureElement<HTMLElement>('.basket__list', this.container);
        this._total = ensureElement<HTMLElement>('.basket__price', this.container);
        this._checkoutButton = ensureElement<HTMLButtonElement>('.basket__button', this.container);

        this._checkoutButton.addEventListener('click', () => {
            this.events.emit('basket:checkout');
        });

        // Подписываемся на обновления корзины
        this.events.on('cart:changed', (data: { items: IProduct[]; total: number }) => {
            this.items = data.items;
            this.total = data.total;
            this.updateView(); // Обновляем отображение при изменении данных
        });
    }

    /**
     * Обновляет отображение корзины
     */
    private updateView(): void {
        const basketCards = this.items.map((item, index) => {
            const card = new BasketCardView(item.id, index + 1, this.events);
            card.setTitle(item.title);
            card.setPrice(item.price);
            return card.render();
        });
        
        this._list.innerHTML = '';
        basketCards.forEach(item => this._list.appendChild(item));
        this._total.textContent = `${this.total} синапсов`;
        this._checkoutButton.disabled = this.items.length === 0;
    }

    render(): HTMLElement {
        // При каждом рендере обновляем отображение актуальными данными
        this.updateView();
        return this.container;
    }
}