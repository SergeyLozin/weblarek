import { Component } from "./Component";

export class HeaderView extends Component<HTMLElement> {
  private _basketButton: HTMLButtonElement;
  private _counter: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);
    this._basketButton = container.querySelector(".header__basket")!;
    this._counter = container.querySelector(".header__basket-counter")!;

    this._basketButton.addEventListener("click", () => {
      this.container.dispatchEvent(
        new CustomEvent("header:basket-click", {
          bubbles: true,
        })
      );
    });
  }

  setCounter(value: number): void {
    this._counter.textContent = value.toString();
  }
}
