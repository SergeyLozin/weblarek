import { ICustomer } from "../../types";
import { EventEmitter } from "../base/Events";
export class CustomerModel {
  private data: ICustomer;

  constructor(private events: EventEmitter) {
    this.data = {
      payment: "card",
      email: "",
      phone: "",
      address: "",
    };
  }

  setPayment(payment: "card" | "cash"): void {
    
    this.data.payment = payment;
    this.events.emit("customer:changed", { data: this.getCustomerData() });
  }

  setEmail(email: string): void {
    this.data.email = email;
    this.events.emit("customer:changed", { data: this.getCustomerData() });
  }

  setPhone(phone: string): void {
    
    this.data.phone = phone;
    this.events.emit("customer:changed", { data: this.getCustomerData() });
  }

  setAddress(address: string): void {
    
    this.data.address = address;
    this.events.emit("customer:changed", { data: this.getCustomerData() });
  }

  setCustomerData(data: ICustomer): void {
    this.data = data;
  }

  getCustomerData(): ICustomer {
    return { ...this.data };
  }

  clearData(): void {
    this.data = {
      payment: "card",
      email: "",
      phone: "",
      address: "",
    };
    this.events.emit("customer:changed", { data: this.getCustomerData() });
  }

  validateData(detailed: boolean = false):
    | boolean
    | {
        isValid: boolean;
        payment: { isValid: boolean; message: string };
        email: { isValid: boolean; message: string };
        phone: { isValid: boolean; message: string };
        address: { isValid: boolean; message: string };
      } {
    const { payment, email, phone, address } = this.data;

    const paymentValid = payment === "card" || payment === "cash";
    const emailValid = email.includes("@") && email.length > 5;
    const phoneValid = /^\d+$/.test(phone) && phone.length >= 10;
    const addressValid = address.trim().length >= 5;

    const isValid = paymentValid && emailValid && phoneValid && addressValid;

    if (!detailed) {
      return isValid;
    }

    return {
      isValid,
      payment: {
        isValid: paymentValid,
        message: paymentValid ? "OK" : "Выберите способ оплаты: card или cash",
      },
      email: {
        isValid: emailValid,
        message: emailValid ? "OK" : "Введите корректный email",
      },
      phone: {
        isValid: phoneValid,
        message: phoneValid ? "OK" : "Введите корректный номер телефона",
      },
      address: {
        isValid: addressValid,
        message: addressValid ? "OK" : "Введите корректный адрес",
      },
    };
  }
}
