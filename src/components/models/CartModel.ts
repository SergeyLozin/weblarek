
import { IProduct } from '../../types';
import { EventEmitter } from '../base/Events';

export class CartModel {
    private items: IProduct[] = [];

    constructor(private events: EventEmitter) {}

     addProduct(product: IProduct): void {
        if (!this.hasProduct(product.id)) {
            this.items.push(product);
            this.emitChange();
        }
    }

    removeProduct(productId: string): void {
        const index = this.items.findIndex(item => item.id === productId);
        if (index !== -1) {
            this.items.splice(index, 1);
            this.emitChange();
        }
    }

    clearCart(): void {
        this.items = [];
        this.emitChange();
    }


    getCartItems(): IProduct[] {
        return [...this.items];
    }

    getTotalAmount(): number {
        return this.items.reduce((total, item) => total + (item.price || 0), 0);
    }

    getItemsCount(): number {
        return this.items.length;
    }

    hasProduct(id: string): boolean {
        return this.items.some(item => item.id === id);
    }

    private emitChange(): void {
        this.events.emit('basket:change'); 
    }
}