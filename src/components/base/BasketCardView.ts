import { CardView } from "./CardView";

export class BasketCardView extends CardView {
  private _index: HTMLElement;
  private _deleteButton: HTMLButtonElement;
  private productId: string;

  constructor(productId: string, index: number) {
    const template = document.getElementById(
      "card-basket"
    ) as HTMLTemplateElement;
    const clone = template.content.cloneNode(true) as DocumentFragment;
    const container = clone.firstElementChild as HTMLElement;
    super(container);

    this._index = container.querySelector(".basket__item-index")!;
    this._deleteButton = container.querySelector(".basket__item-delete")!;
    this.productId = productId;

    this._index.textContent = index.toString();

    this._deleteButton.addEventListener("click", (e) => {
      e.stopPropagation();
      this.container.dispatchEvent(
        new CustomEvent("basket:remove-item", {
          detail: { productId: this.productId },
          bubbles: true,
        })
      );
    });
  }

  setTitle(title: string): void {
    this._title.textContent = title;
  }

  setPrice(price: number | null): void {
    this._price.textContent = price ? `${price} синапсов` : "Бесценно";
  }
}
