import { Component } from "../base/Component";
import { EventEmitter } from "../base/Events";

export class HeaderView extends Component<HTMLElement> {
    private _basketButton: HTMLButtonElement;
    private _counter: HTMLElement;

    constructor(container: HTMLElement, events: EventEmitter) {
        super(container);
        this._basketButton = this.container.querySelector('.header__basket')!;
        this._counter = this.container.querySelector('.header__basket-counter')!;

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
