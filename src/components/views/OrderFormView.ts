
import { FormView } from './FormView';
import { EventEmitter } from '../base/Events';
import { ensureAllElements } from '../../utils/utils';

export class OrderFormView extends FormView {
    private _addressInput: HTMLInputElement;
    private _paymentButtons: HTMLButtonElement[];

    constructor(events: EventEmitter) {
        const template = document.getElementById('order') as HTMLTemplateElement;
        const container = template.content.cloneNode(true) as DocumentFragment;
        const form = container.querySelector('form') as HTMLElement;
        super(form, events);

        this._addressInput = this.container.querySelector('input[name="address"]')!;
        this._paymentButtons = ensureAllElements<HTMLButtonElement>('button[name]', this.container);

        this.setPaymentMethod('card');
        this.setupEventListeners();
    }

    private setupEventListeners(): void {
        // Обработчик ввода адреса
        this._addressInput.addEventListener('input', (event: Event) => {
            const target = event.target as HTMLInputElement;
            this.events.emit('order:fieldChange', {
                field: 'address',
                value: target.value
            });
        });

        // Обработчики кнопок оплаты
        this._paymentButtons.forEach(button => {
            button.addEventListener('click', (event: Event) => {
                event.preventDefault();
                const target = event.target as HTMLButtonElement;
                const method = target.name as string;
                this.setPaymentMethod(method);
                this.events.emit('order:fieldChange', {
                    field: 'payment',
                    value: method
                });
            });
        });

        // Обработчик отправки формы
        this.container.addEventListener('submit', (event: Event) => {
            event.preventDefault();
            this.events.emit('order:submit');
        });
    }

    setPaymentMethod(method: string): void {
        this._paymentButtons.forEach(button => {
            button.classList.toggle('button_alt-active', button.name === method);
        });
    }

    setPayment(payment: string): void {
        this.setPaymentMethod(payment);
    }

    setAddress(address: string): void {
        this._addressInput.value = address;
    }

    setErrors(errors: Record<string, string>): void {
        super.setErrors(errors);
        
        // Подсветка полей с ошибками
        if (errors.address) {
            this._addressInput.classList.add('form__input_error');
        } else {
            this._addressInput.classList.remove('form__input_error');
        }
    }

    getData(): { payment: string; address: string } {
        const activeButton = this._paymentButtons.find(btn => 
            btn.classList.contains('button_alt-active')
        );
        
        return {
            payment: activeButton?.name || 'card',
            address: this._addressInput.value
        };
    }
}