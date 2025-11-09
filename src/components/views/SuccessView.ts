import { Component } from "../base/Component";
import { EventEmitter } from "../base/Events";
import { ensureElement } from "../../utils/utils";

export class SuccessView extends Component<HTMLElement> {
    private _description: HTMLElement;
    private _closeButton: HTMLButtonElement;

    constructor(private events: EventEmitter) {
        const template = document.getElementById('success') as HTMLTemplateElement;
        const container = template.content.cloneNode(true) as DocumentFragment;
        const element = container.firstElementChild as HTMLElement;
        super(element);
        
        this._description = ensureElement<HTMLElement>('.order-success__description', this.container);
        this._closeButton = ensureElement<HTMLButtonElement>('.order-success__close', this.container);

        this._closeButton.addEventListener('click', () => {
            this.events.emit('success:close');
        });
    }

    /**
     * Устанавливает сумму успешного заказа
     * @param total - сумма заказа
     */
    setTotal(total: number): void {
        this._description.textContent = `Списано ${total} синапсов`;
    }

    render(): HTMLElement {
        return this.container;
    }
}