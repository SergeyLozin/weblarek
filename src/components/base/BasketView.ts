import { Component } from "./Component";

export class BasketView extends Component<HTMLElement> {
  private _list: HTMLElement;
  private _total: HTMLElement;
  private _checkoutButton: HTMLButtonElement;

  constructor(items: HTMLElement[], total: number) {
    const template = document.getElementById("basket") as HTMLTemplateElement;
    const clone = template.content.cloneNode(true) as DocumentFragment;
    const container = clone.firstElementChild as HTMLElement;
    super(container);

    this._list = container.querySelector(".basket__list")!;
    this._total = container.querySelector(".basket__price")!;
    this._checkoutButton = container.querySelector(".basket__button")!;

    this._list.innerHTML = "";
    items.forEach((item) => this._list.appendChild(item));
    this._total.textContent = `${total} синапсов`;
    this._checkoutButton.disabled = items.length === 0;

    this._checkoutButton.addEventListener("click", () => {
      this.container.dispatchEvent(
        new CustomEvent("basket:checkout", {
          bubbles: true,
        })
      );
    });
  }
}
