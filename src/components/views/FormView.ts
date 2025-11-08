
import { Component } from '../base/Component';
import { EventEmitter } from '../base/Events';

export abstract class FormView extends Component<HTMLElement> {
    protected _submitButton: HTMLButtonElement;
    protected _errors: HTMLElement;

    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container);
        this._submitButton = this.container.querySelector('button[type="submit"]')!;
        this._errors = this.container.querySelector('.form__errors')!;
        
        // Изначально кнопка заблокирована
        this._submitButton.disabled = true;
    }

    protected setErrors(errors: Record<string, string>): void {
        const errorMessages = Object.values(errors).filter(msg => msg);
        if (errorMessages.length > 0) {
            this._errors.textContent = errorMessages.join(', ');
        } else {
            this._errors.textContent = '';
        }
    }

    protected clearErrors(): void {
        this._errors.textContent = '';
    }

    setValid(valid: boolean): void {
        this._submitButton.disabled = !valid;
    }

    abstract getData(): any;

    render(): HTMLElement {
        return this.container;
    }
}