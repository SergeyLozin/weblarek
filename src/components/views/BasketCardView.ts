import { CardView } from "./CardView";
import { EventEmitter } from "../base/Events";
import { ensureElement } from "../../utils/utils";

export class BasketCardView extends CardView {
    private _index: HTMLElement;
    private _deleteButton: HTMLButtonElement;

    constructor(productId: string, index: number, events: EventEmitter) {
        const template = document.getElementById('card-basket') as HTMLTemplateElement;
        const container = template.content.cloneNode(true) as DocumentFragment;
        const element = container.firstElementChild as HTMLElement;
        super(element, productId, events);

        this._index = ensureElement<HTMLElement>('.basket__item-index', this.container);
        this._deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);

        this._index.textContent = index.toString();

        this._deleteButton.addEventListener('click', (e) => {
            e.stopPropagation();
            this.events.emit('basket:removeItem', { productId: this.productId });
        });
    }

    render(): HTMLElement {
        return this.container;
    }
}
