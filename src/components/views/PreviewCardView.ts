
import { CardView } from './CardView';
import { EventEmitter } from '../base/Events';
import { ensureElement } from '../../utils/utils';

export class PreviewCardView extends CardView {
    private _description: HTMLElement;
    private _button: HTMLButtonElement;

    constructor(events: EventEmitter) {
        const template = document.getElementById('card-preview') as HTMLTemplateElement;
        const container = template.content.cloneNode(true) as DocumentFragment;
        const element = container.firstElementChild as HTMLElement;
        super(element, '', events);

        this._description = ensureElement<HTMLElement>('.card__text', this.container);
        this._button = ensureElement<HTMLButtonElement>('.card__button', this.container);

        this._button.addEventListener('click', () => {
            if (this.productId) {
                this.events.emit('cart:toggle', { productId: this.productId });
            }
        });
    }

    setDescription(description: string): void {
        this._description.textContent = description;
    }

    setButtonText(text: string): void {
        this._button.textContent = text;
    }

    setButtonDisabled(disabled: boolean): void {
        this._button.disabled = disabled;
    }

    updateButtonState(inCart: boolean): void {
        if (inCart) {
            this._button.textContent = 'Удалить из корзины';
            this._button.disabled = false;
        } else {
            this._button.textContent = 'В корзину';
            this._button.disabled = false;
        }
    }

    render(): HTMLElement {
        return this.container;
    }
}