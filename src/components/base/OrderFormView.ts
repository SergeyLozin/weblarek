import { FormView } from "./FormView";

export class OrderFormView extends FormView {
  private _addressInput: HTMLInputElement;
  private _cardButton: HTMLButtonElement;
  private _cashButton: HTMLButtonElement;

  constructor() {
    const template = document.getElementById("order") as HTMLTemplateElement;
    const clone = template.content.cloneNode(true) as DocumentFragment;
    const container = clone.querySelector("form") as HTMLFormElement;
    super(container);

    this._addressInput = container.querySelector('input[name="address"]')!;
    this._cardButton = container.querySelector('button[name="card"]')!;
    this._cashButton = container.querySelector('button[name="cash"]')!;

    this.setPaymentMethod("card");

    this._addressInput.addEventListener("input", () => {
      this.validateForm();
      this.container.dispatchEvent(
        new CustomEvent("address:change", { bubbles: true })
      );
    });

    this._cardButton.addEventListener("click", () => {
      this.setPaymentMethod("card");
      this.validateForm();
      this.container.dispatchEvent(
        new CustomEvent("payment:change", {
          detail: { method: "card" },
          bubbles: true,
        })
      );
    });

    this._cashButton.addEventListener("click", () => {
      this.setPaymentMethod("cash");
      this.validateForm();
      this.container.dispatchEvent(
        new CustomEvent("payment:change", {
          detail: { method: "cash" },
          bubbles: true,
        })
      );
    });

    this.container.addEventListener("submit", (event) => {
      event.preventDefault();

      if (this.isFormValid()) {
        this.container.dispatchEvent(
          new CustomEvent("form:submit", {
            bubbles: true,
          })
        );
      } else {
        console.warn("OrderForm: форма невалидна, отправка заблокирована");
      }
    });

    this.validateForm();
  }

  private setPaymentMethod(method: string): void {
    this._cardButton.classList.toggle("button_alt-active", method === "card");
    this._cashButton.classList.toggle("button_alt-active", method === "cash");
  }

  private validateForm(): void {
    const isValid = this.isFormValid();
    this.setValid(isValid);
  }

  private isFormValid(): boolean {
    const data = this.getData();
    return data.address.trim().length >= 5;
  }

  setPayment(method: string): void {
    this.setPaymentMethod(method);
    this.validateForm();
  }

  setAddress(address: string): void {
    this._addressInput.value = address;
    this.validateForm();
  }

  getData(): { payment: string; address: string } {
    const payment = this._cardButton.classList.contains("button_alt-active")
      ? "card"
      : "cash";
    return {
      payment,
      address: this._addressInput.value,
    };
  }
}
