import { IProduct } from '../../types';

export class CartModel {
    private items: IProduct[];

    constructor() {
        this.items = [];
    }

    getCartItems(): IProduct[] {
        return [...this.items];
    }

    addProduct(product: IProduct): void {
        this.items.push(product);
    }

    removeProduct(product: IProduct): void {
        const index = this.items.findIndex(item => item.id === product.id);
        if (index !== -1) {
            this.items.splice(index, 1);
        }
    }

    clearCart(): void {
        this.items = [];
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
        return this.items.some(item => item.id === id);
    }
}