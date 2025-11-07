import { FormView } from "./FormView";

export class ContactsFormView extends FormView {
  private _emailInput: HTMLInputElement;
  private _phoneInput: HTMLInputElement;

  constructor() {
    const template = document.getElementById("contacts") as HTMLTemplateElement;
    const clone = template.content.cloneNode(true) as DocumentFragment;
    const container = clone.querySelector("form") as HTMLFormElement;
    super(container);

    this._emailInput = container.querySelector('input[name="email"]')!;
    this._phoneInput = container.querySelector('input[name="phone"]')!;

    this._emailInput.addEventListener("input", () => {
      this.validateForm();
      this.container.dispatchEvent(
        new CustomEvent("email:change", { bubbles: true })
      );
    });

    this._phoneInput.addEventListener("input", () => {
      this.validateForm();
      this.container.dispatchEvent(
        new CustomEvent("phone:change", { bubbles: true })
      );
    });

    this.container.addEventListener("submit", (event) => {
      event.preventDefault();

      if (this.isFormValid()) {
        this.container.dispatchEvent(
          new CustomEvent("contacts:submit", {
            bubbles: true,
          })
        );
      } else {
      }
    });

    this.validateForm();
  }

  private validateForm(): void {
    const isValid = this.isFormValid();
    this.setValid(isValid);
  }

  private isFormValid(): boolean {
    const data = this.getData();
    return this.validateEmail(data.email) && this.validatePhone(data.phone);
  }

  private validateEmail(email: string): boolean {
    return email.includes("@") && email.length > 5;
  }

  private validatePhone(phone: string): boolean {
    const cleaned = phone.replace(/\D/g, "");
    return cleaned.length >= 10;
  }

  setEmail(email: string): void {
    this._emailInput.value = email;
    this.validateForm();
  }

  setPhone(phone: string): void {
    this._phoneInput.value = phone;
    this.validateForm();
  }

  getData(): { email: string; phone: string } {
    return {
      email: this._emailInput.value,
      phone: this._phoneInput.value,
    };
  }
}
