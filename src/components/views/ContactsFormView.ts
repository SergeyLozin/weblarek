
import { FormView } from './FormView';
import { EventEmitter } from '../base/Events';

export class ContactsFormView extends FormView {
    private _emailInput: HTMLInputElement;
    private _phoneInput: HTMLInputElement;

    constructor(events: EventEmitter) {
        const template = document.getElementById('contacts') as HTMLTemplateElement;
        const container = template.content.cloneNode(true) as DocumentFragment;
        const form = container.querySelector('form') as HTMLElement;
        super(form, events);

        this._emailInput = this.container.querySelector('input[name="email"]')!;
        this._phoneInput = this.container.querySelector('input[name="phone"]')!;

        this.setupEventListeners();
    }

    private setupEventListeners(): void {
        // Обработчики полей ввода
        [this._emailInput, this._phoneInput].forEach(input => {
            input.addEventListener('input', (event: Event) => {
                const target = event.target as HTMLInputElement;
                this.events.emit('contacts:fieldChange', {
                    field: target.name,
                    value: target.value
                });
            });
        });

        // Обработчик отправки формы
        this.container.addEventListener('submit', (event: Event) => {
            event.preventDefault();
            this.events.emit('contacts:submit');
        });
    }

    setEmail(email: string): void {
        this._emailInput.value = email;
    }

    setPhone(phone: string): void {
        this._phoneInput.value = phone;
    }

    setErrors(errors: Record<string, string>): void {
        super.setErrors(errors);
        
        // Подсветка полей с ошибками
        if (errors.email) {
            this._emailInput.classList.add('form__input_error');
        } else {
            this._emailInput.classList.remove('form__input_error');
        }

        if (errors.phone) {
            this._phoneInput.classList.add('form__input_error');
        } else {
            this._phoneInput.classList.remove('form__input_error');
        }
    }

    getData(): { email: string; phone: string } {
        return {
            email: this._emailInput.value,
            phone: this._phoneInput.value
        };
    }
}