import { IProduct } from "../../types";
import { EventEmitter } from "../base/Events";

export class CartModel {
  private items: IProduct[];

  constructor(private events: EventEmitter) {
    this.items = [];
  }

  getCartItems(): IProduct[] {
    return [...this.items];
  }

  addProduct(product: IProduct): void {
    this.items.push(product);
    this.events.emit("cart:changed", {
      items: this.items,
      total: this.getTotalAmount(),
      count: this.getItemsCount(),
    });
  }

  removeProduct(product: IProduct): void {
    const index = this.items.findIndex((item) => item.id === product.id);
    if (index !== -1) {
      this.items.splice(index, 1);
      this.events.emit("cart:changed", {
        items: this.items,
        total: this.getTotalAmount(),
        count: this.getItemsCount(),
      });
    }
  }

  clearCart(): void {
    this.items = [];

    this.emitCartChanged();
    console.log("🛒 Корзина очищена");
  }

  private emitCartChanged(): void {
    const cartData = {
      items: this.items,
      total: this.getTotalAmount(),
      count: this.getItemsCount(),
    };

    console.log("📢 Emitting cart:changed", cartData);
    this.events.emit("cart:changed", cartData);
  }

  getTotalAmount(): number {
    return this.items.reduce((total, item) => {
      return total + (item.price || 0);
    }, 0);
  }

  getItemsCount(): number {
    return this.items.length;
  }

  hasProduct(id: string): boolean {
    return this.items.some((item) => item.id === id);
  }
}
