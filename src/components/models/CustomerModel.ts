
import { ICustomer } from '../../types';
import { EventEmitter } from '../base/Events';

export class CustomerModel {
    private data: ICustomer;

    constructor(private events: EventEmitter) {
        this.data = this.getDefaultData();
        
        setTimeout(() => this.validate(), 0);
    }

    private getDefaultData(): ICustomer {
        return {
            payment: 'card',
            email: '',
            phone: '',
            address: '',
        };
    }

    setData(key: keyof ICustomer, value: string): void {
        if (key === 'payment') {
            this.data[key] = value as 'card' | 'cash';
        } else {
            this.data[key] = value;
        }
        this.validate();
    }

    getCustomerData(): ICustomer {
        return { ...this.data };
    }

    clearData(): void {
        this.data = this.getDefaultData();
        this.events.emit('customer:cleared');
        this.validate();
    }

    private validate(): void {
        const errors: Partial<Record<keyof ICustomer, string>> = {};
        const { payment, email, phone, address } = this.data;

        // Валидация payment
        if (payment !== 'card' && payment !== 'cash') {
            errors.payment = 'Выберите способ оплаты';
        }

        // Валидация email
        if (email && (!email.includes('@') || email.length <= 5)) {
            errors.email = 'Введите корректный email';
        }

        // Валидация phone
        const cleanedPhone = phone.replace(/\D/g, '');
        if (phone && cleanedPhone.length < 10) {
            errors.phone = 'Введите корректный номер телефона';
        }

        // Валидация address
        if (address && address.trim().length < 5) {
            errors.address = 'Адрес должен содержать не менее 5 символов';
        }

        // Проверка заполненности для каждой формы
        const orderFormValid = payment && address.trim().length >= 5;
        const contactsFormValid = email && phone && 
                                 email.includes('@') && email.length > 5 && 
                                 cleanedPhone.length >= 10;

        this.events.emit('customer:errors', { errors });
        this.events.emit('order:valid', { isValid: orderFormValid });
        this.events.emit('contacts:valid', { isValid: contactsFormValid });
    }

    isOrderValid(): boolean {
        const { payment, address } = this.data;
        return (payment === 'card' || payment === 'cash') && address.trim().length >= 5;
    }

    isContactsValid(): boolean {
        const { email, phone } = this.data;
        const cleanedPhone = phone.replace(/\D/g, '');
        return email.includes('@') && email.length > 5 && cleanedPhone.length >= 10;
    }
}