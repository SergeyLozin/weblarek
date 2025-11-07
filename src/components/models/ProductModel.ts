import { IProduct } from '../../types';
import { EventEmitter } from '../base/Events';

export class ProductModel {
    private products: IProduct[];
    private selectedProduct: IProduct | null;

    constructor(private events: EventEmitter){
        this.products = [];
        this.selectedProduct = null;
    }

    setProducts(products: IProduct[]): void {
        this.products = products;
        this.events.emit('products:changed', { products: this.products });
    }

    getProducts(): IProduct[] {
        return [...this.products];
    }

    getProductById(id: string): IProduct | undefined {
        return this.products.find(product => product.id === id);
    }

    setSelectedProduct(product: IProduct | null): void {
        this.selectedProduct = product;
        this.events.emit('product:selected', { product: this.selectedProduct });
    }

    getSelectedProduct(): IProduct | null {
        return this.selectedProduct;
    }
}