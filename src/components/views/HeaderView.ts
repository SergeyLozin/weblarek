import { Component } from "../base/Component";
import { EventEmitter } from "../base/Events";
import { ensureElement } from "../../utils/utils";

export class HeaderView extends Component<HTMLElement> {
    private _basketButton: HTMLButtonElement;
    private _counter: HTMLElement;

    constructor(container: HTMLElement, events: EventEmitter) {
        super(container);
        this._basketButton = ensureElement<HTMLButtonElement>('.header__basket', this.container);
        this._counter = ensureElement<HTMLElement>('.header__basket-counter', this.container);

        this._basketButton.addEventListener('click', () => {
            events.emit('header:basketClick');
        });
    }

    setCounter(value: number): void {
        this._counter.textContent = value.toString();
    }

    render(): HTMLElement {
        return this.container;
    }
}