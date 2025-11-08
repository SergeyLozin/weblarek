import { Component } from "../base/Component";
import { EventEmitter } from "../base/Events";

export class BasketView extends Component<HTMLElement> {
    private _list: HTMLElement;
    private _total: HTMLElement;
    private _checkoutButton: HTMLButtonElement;

    constructor(events: EventEmitter) {
        const template = document.getElementById('basket') as HTMLTemplateElement;
        const container = template.content.cloneNode(true) as DocumentFragment;
        const element = container.firstElementChild as HTMLElement;
        super(element);

        this._list = this.container.querySelector('.basket__list')!;
        this._total = this.container.querySelector('.basket__price')!;
        this._checkoutButton = this.container.querySelector('.basket__button')!;

        this._checkoutButton.addEventListener('click', () => {
            events.emit('basket:checkout');
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
