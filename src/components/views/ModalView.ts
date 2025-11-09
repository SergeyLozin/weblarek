import { Component } from "../base/Component";
import { EventEmitter } from "../base/Events";
import { ensureElement } from "../../utils/utils";

export class ModalView extends Component<HTMLElement> {
    private _closeButton: HTMLButtonElement;
    private _content: HTMLElement;

    constructor(private events: EventEmitter) {
        const container = document.getElementById('modal-container') as HTMLElement;
        super(container);
        
        this._closeButton = ensureElement<HTMLButtonElement>('.modal__close', this.container);
        this._content = ensureElement<HTMLElement>('.modal__content', this.container);

        this._closeButton.addEventListener('click', () => {
            this.close();
            this.events.emit('modal:close');
        });

        this.container.addEventListener('click', (event) => {
            if (event.target === this.container) {
                this.close();
                this.events.emit('modal:close');
            }
        });

        // Блокировка скролла
        this.events.on('modal:open', () => {
            document.body.style.overflow = 'hidden';
        });

        this.events.on('modal:close', () => {
            document.body.style.overflow = '';
        });
    }

    open(content: HTMLElement): void {
        this._content.innerHTML = '';
        this._content.appendChild(content);
        this.container.classList.add('modal_active');
        this.events.emit('modal:open');
    }

    close(): void {
        this.container.classList.remove('modal_active');
        this._content.innerHTML = '';
        this.events.emit('modal:close');
    }

    // Добавляем метод для проверки открыто ли модальное окно
    isOpen(): boolean {
        return this.container.classList.contains('modal_active');
    }

    render(): HTMLElement {
        return this.container;
    }
}