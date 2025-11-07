import { CardView } from "./CardView";

export class PreviewCardView extends CardView {
  private _description: HTMLElement;
  private _button: HTMLButtonElement;
  private productId: string;

  constructor(productId: string) {
    const template = document.getElementById(
      "card-preview"
    ) as HTMLTemplateElement;
    const clone = template.content.cloneNode(true) as DocumentFragment;
    const container = clone.firstElementChild as HTMLElement;
    super(container);

    this._description = container.querySelector(".card__text")!;
    this._button = container.querySelector(".card__button")!;
    this.productId = productId;

    this._button.addEventListener("click", () => {
      this.container.dispatchEvent(
        new CustomEvent("product:add-to-cart", {
          detail: { productId: this.productId },
          bubbles: true,
        })
      );
    });
  }

  setDescription(description: string): void {
    this._description.textContent = description;
  }

  setButtonText(text: string): void {
    this._button.textContent = text;
  }

  setButtonDisabled(disabled: boolean): void {
    this._button.disabled = disabled;
  }
}
