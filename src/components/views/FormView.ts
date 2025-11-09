
import { Component } from '../base/Component';
import { EventEmitter } from '../base/Events';
import { ensureElement, ensureAllElements } from '../../utils/utils';

export abstract class FormView extends Component<HTMLElement> {
    protected _submitButton: HTMLButtonElement;
    protected _errors: HTMLElement;

    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container);
        this._submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', this.container);
        this._errors = ensureElement<HTMLElement>('.form__errors', this.container);
        
        this._submitButton.disabled = true;
        
        // Устанавливаем общие обработчики для полей ввода
        this.setupInputListeners();
    }

    /**
     * Устанавливает обработчики для всех полей ввода в форме
     */
    private setupInputListeners(): void {
        const inputs = ensureAllElements<HTMLInputElement>('input', this.container);
        
        inputs.forEach(input => {
            input.addEventListener('input', (event: Event) => {
                const target = event.target as HTMLInputElement;
                this.events.emit('form:fieldChange', {
                    field: target.name,
                    value: target.value
                });
            });
        });
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