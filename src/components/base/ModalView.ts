import { Component } from "./Component";

export class ModalView extends Component<HTMLElement> {
  private _closeButton: HTMLButtonElement;
  private _content: HTMLElement;

  constructor() {
    const container = document.getElementById("modal-container") as HTMLElement;
    super(container);

    this._closeButton = container.querySelector(".modal__close")!;
    this._content = container.querySelector(".modal__content")!;

    this._closeButton.addEventListener("click", () => {
      this.close();
      this.container.dispatchEvent(
        new CustomEvent("modal:close", {
          bubbles: true,
        })
      );
    });

    this.container.addEventListener("click", (event) => {
      if (event.target === this.container) {
        this.close();
        this.container.dispatchEvent(
          new CustomEvent("modal:close", {
            bubbles: true,
          })
        );
      }
    });
  }

  open(content: HTMLElement): void {
    this._content.innerHTML = "";
    this._content.appendChild(content);
    this.container.classList.add("modal_active");
  }

  close(): void {
    this.container.classList.remove("modal_active");
    this._content.innerHTML = "";
  }
}
