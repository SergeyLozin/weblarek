import { CardView } from "./CardView";

export class CatalogCardView extends CardView {
  constructor() {
    const template = document.getElementById(
      "card-catalog"
    ) as HTMLTemplateElement;
    const clone = template.content.cloneNode(true) as DocumentFragment;
    const container = clone.firstElementChild as HTMLElement;
    super(container);

    this.container.addEventListener("click", () => {
      const productId = this.container.dataset.productId;
      if (productId) {
        this.container.dispatchEvent(
          new CustomEvent("card:select", {
            detail: { productId },
            bubbles: true,
          })
        );
      }
    });
  }
}
