import { Component } from "./Component";

export abstract class FormView extends Component<HTMLFormElement> {
  protected _submitButton: HTMLButtonElement;
  protected _errors: HTMLElement;

  constructor(container: HTMLFormElement) {
    super(container);
    this._submitButton = container.querySelector('button[type="submit"]')!;
    this._errors = container.querySelector(".form__errors")!;

    // Блокируем кнопку по умолчанию
    this._submitButton.disabled = true;
  }

  protected setErrors(message: string): void {
    this._errors.textContent = message;
  }

  protected clearErrors(): void {
    this._errors.textContent = "";
  }

  protected setValid(valid: boolean): void {
    console.log("🔘 FormView: установка состояния кнопки", {
      valid,
      disabled: !valid,
    });
    this._submitButton.disabled = !valid;
  }

  abstract getData(): any;
}
