import { Component } from "./Component";

export abstract class CardView extends Component<HTMLElement> {
  protected _title: HTMLElement;
  protected _price: HTMLElement;
  protected _category: HTMLElement;
  protected _image: HTMLImageElement;

  constructor(container: HTMLElement) {
    super(container);
    this._title = container.querySelector(".card__title")!;
    this._price = container.querySelector(".card__price")!;
    this._category = container.querySelector(".card__category")!;
    this._image = container.querySelector(".card__image")!;
  }

  setTitle(title: string): void {
    this._title.textContent = title;
  }

  setPrice(price: number | null): void {
    this._price.textContent = price ? `${price} синапсов` : "Бесценно";
  }

  setCategory(category: string, categoryClass: string): void {
    this._category.textContent = category;
    this._category.className = `card__category card__category_${categoryClass}`;
  }

  setupImage(src: string, alt: string): void {
    this.setImage(this._image, src, alt);
  }

  render(): HTMLElement {
    return this.container;
  }
}
