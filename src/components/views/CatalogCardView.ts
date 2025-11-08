import { CardView } from "./CardView";
import { EventEmitter } from "../base/Events";

export class CatalogCardView extends CardView {
    constructor(productId: string, events: EventEmitter) {
        const template = document.getElementById('card-catalog') as HTMLTemplateElement;
        const container = template.content.cloneNode(true) as DocumentFragment;
        const element = container.firstElementChild as HTMLElement;
        super(element, productId, events);

        this.container.addEventListener('click', () => {
            events.emit('card:select', { productId: this.productId });
        });
    }

    render(): HTMLElement {
        return this.container;
    }
}
