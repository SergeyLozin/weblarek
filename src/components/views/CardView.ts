import { Component } from "../base/Component";
import { EventEmitter } from "../base/Events";
import { ensureElement } from "../../utils/utils";

export abstract class CardView extends Component<HTMLElement> {
    protected _title: HTMLElement;
    protected _price: HTMLElement;
    protected _category: HTMLElement | null;
    protected _image: HTMLImageElement | null;
    public productId: string;

    constructor(container: HTMLElement, productId: string, protected events: EventEmitter) {
        super(container);
        this.productId = productId;
        
        // Обязательные элементы
        this._title = ensureElement<HTMLElement>('.card__title', this.container);
        this._price = ensureElement<HTMLElement>('.card__price', this.container);
        
        // Опциональные элементы (могут отсутствовать в некоторых шаблонах)
        this._category = this.findOptionalElement('.card__category');
        this._image = this.findOptionalElement<HTMLImageElement>('.card__image');
    }

    // Вспомогательный метод для поиска опциональных элементов
    private findOptionalElement<T extends HTMLElement>(selector: string): T | null {
        try {
            return ensureElement<T>(selector, this.container);
        } catch {
            return null;
        }
    }

    setTitle(title: string): void {
        this._title.textContent = title;
    }

    setPrice(price: number | null): void {
        this._price.textContent = price ? `${price} синапсов` : 'Бесценно';
    }

    setCategory(category: string, categoryClass: string): void {
        if (this._category) {
            this._category.textContent = category;
            this._category.className = `card__category ${categoryClass}`;
        }
    }

    setupImage(src: string, alt: string): void {
        if (this._image) {
            this.setImage(this._image, src, alt);
        }
    }

    render(): HTMLElement {
        return this.container;
    }
}
