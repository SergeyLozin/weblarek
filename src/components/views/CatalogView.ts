import { Component } from "../base/Component";

export class CatalogView extends Component<HTMLElement> {
    constructor(container: HTMLElement) {
        super(container);
    }

    setItems(items: HTMLElement[]): void {
        this.container.innerHTML = '';
        items.forEach(item => this.container.appendChild(item));
    }

    render(): HTMLElement {
        return this.container;
    }
}
