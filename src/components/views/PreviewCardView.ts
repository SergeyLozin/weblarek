
import { CardView } from './CardView';
import { EventEmitter } from '../base/Events';

export class PreviewCardView extends CardView {
    private _description: HTMLElement;
    private _button: HTMLButtonElement;

    constructor(productId: string, events: EventEmitter, inCart: boolean) {
        const template = document.getElementById('card-preview') as HTMLTemplateElement;
        const container = template.content.cloneNode(true) as DocumentFragment;
        const element = container.firstElementChild as HTMLElement;
        super(element, productId, events);

        this._description = this.container.querySelector('.card__text')!;
        this._button = this.container.querySelector('.card__button')!;

        // Устанавливаем начальное состояние кнопки
        this.updateButton(inCart);

        this._button.addEventListener('click', () => {
            if (inCart) {
                this.events.emit('product:removeFromCart', { productId: this.productId });
            } else {
                this.events.emit('product:addToCart', { productId: this.productId });
            }
        });
    }

    private updateButton(inCart: boolean): void {
        if (inCart) {
            this._button.textContent = 'Уже в корзине';
            this._button.disabled = true;
        } else {
            this._button.textContent = 'В корзину';
            this._button.disabled = false;
        }
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

    render(): HTMLElement {
        return this.container;
    }
}