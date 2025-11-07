import { Component } from "./Component";

export class SuccessView extends Component<HTMLElement> {
  private _description: HTMLElement;
  private _closeButton: HTMLButtonElement;

  constructor(total: number) {
    const template = document.getElementById("success") as HTMLTemplateElement;
    const clone = template.content.cloneNode(true) as DocumentFragment;
    const container = clone.firstElementChild as HTMLElement;
    super(container);

    this._description = container.querySelector(".order-success__description")!;
    this._closeButton = container.querySelector(".order-success__close")!;

    this._description.textContent = `Списано ${total} синапсов`;

    this._closeButton.addEventListener("click", () => {
      this.container.dispatchEvent(
        new CustomEvent("success:close", {
          bubbles: true,
        })
      );
    });
  }
}
