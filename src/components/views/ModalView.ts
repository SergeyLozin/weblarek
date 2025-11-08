import { Component } from "../base/Component";
import { EventEmitter } from "../base/Events";

export class ModalView extends Component<HTMLElement> {
    private _closeButton: HTMLButtonElement;
    private _content: HTMLElement;

    constructor(private events: EventEmitter) {
        const container = document.getElementById('modal-container') as HTMLElement;
        super(container);
        
        this._closeButton = this.container.querySelector('.modal__close')!;
        this._content = this.container.querySelector('.modal__content')!;

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

    render(): HTMLElement {
        return this.container;
    }
}