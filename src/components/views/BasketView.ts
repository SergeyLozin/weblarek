import { Component } from "../base/Component";
import { EventEmitter } from "../base/Events";
import { ensureElement } from "../../utils/utils";


export class BasketView extends Component<HTMLElement> {
    private _list: HTMLElement;
    private _total: HTMLElement;
    private _checkoutButton: HTMLButtonElement;

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
    }

    setItems(items: HTMLElement[]): void {
        this._list.innerHTML = '';
        items.forEach(item => this._list.appendChild(item));
    }

    setTotal(total: number): void {
        this._total.textContent = `${total} синапсов`;
    }

    setCheckoutEnabled(enabled: boolean): void {
        this._checkoutButton.disabled = !enabled;
    }

    render(): HTMLElement {
        return this.container;
    }
}