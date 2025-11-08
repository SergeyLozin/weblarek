import { Component } from "../base/Component";
import { EventEmitter } from "../base/Events";

export class SuccessView extends Component<HTMLElement> {
    private _description: HTMLElement;
    private _closeButton: HTMLButtonElement;

    constructor(total: number, private events: EventEmitter) {
        const template = document.getElementById('success') as HTMLTemplateElement;
        const container = template.content.cloneNode(true) as DocumentFragment;
        const element = container.firstElementChild as HTMLElement;
        super(element);
        
        this._description = this.container.querySelector('.order-success__description')!;
        this._closeButton = this.container.querySelector('.order-success__close')!;
        
        this._description.textContent = `Списано ${total} синапсов`;

        this._closeButton.addEventListener('click', () => {
            this.events.emit('success:close');
        });
    }

    render(): HTMLElement {
        return this.container;
    }
}
