import { ICustomer } from '../../types';

export class CustomerModel {
    private data: ICustomer;

    constructor() {
        this.data = {
            payment: 'card',
            email: '',
            phone: '',
            address: ''
        };
    }

    //  Отдельные методы для полей 

    setPayment(payment: 'card' | 'cash'): void {
        this.data.payment = payment;
    }

    setEmail(email: string): void {
        this.data.email = email;
    }

    setPhone(phone: string): void {
        this.data.phone = phone;
    }

    setAddress(address: string): void {
        this.data.address = address;
    }

    setCustomerData(data: ICustomer): void {
        this.data = data;
    }

    getCustomerData(): ICustomer {
        return { ...this.data };
    }

    clearData(): void {
        this.data = {
            payment: 'card',
            email: '',
            phone: '',
            address: ''
        };
    }

    
    validateData(detailed: boolean = false): boolean | {
        isValid: boolean;
        payment: { isValid: boolean; message: string };
        email: { isValid: boolean; message: string };
        phone: { isValid: boolean; message: string };
        address: { isValid: boolean; message: string };
    } {
        const { payment, email, phone, address } = this.data;

        const paymentValid = payment === 'card' || payment === 'cash';
        const emailValid = email.includes('@') && email.length > 5;
        const phoneValid = /^\d+$/.test(phone) && phone.length >= 10;
        const addressValid = address.trim().length >= 5;

        const isValid = paymentValid && emailValid && phoneValid && addressValid;

        // Если хотим проверить просто т.е не детально
        if (!detailed) {
            return isValid;
        }

        // Если хотим проверить детально
        return {
            isValid,
            payment: {
                isValid: paymentValid,
                message: paymentValid ? 'OK' : 'Выберите способ оплаты: card или cash'
            },
            email: {
                isValid: emailValid,
                message: emailValid ? 'OK' : 'Введите корректный email'
            },
            phone: {
                isValid: phoneValid,
                message: phoneValid ? 'OK' : 'Введите корректный номер телефона'
            },
            address: {
                isValid: addressValid,
                message: addressValid ? 'OK' : 'Введите корректный адрес'
            }
        };
    }

     

}