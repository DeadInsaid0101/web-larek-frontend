import { IProductItem } from "../../types";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/events";
import { Component } from "./Component";

interface IBasket {
  items: HTMLElement[];
  total: number;
}

export class Basket extends Component<IBasket> {
  protected container: HTMLElement
  protected basketList: HTMLElement
  protected total: HTMLElement
  continueButton: HTMLButtonElement


  constructor(container: HTMLElement, events: IEvents) {
    super(container)

    this.basketList = ensureElement<HTMLElement>('.basket__list', container)
    this.total = ensureElement<HTMLElement>('.basket__price', container);
    this.continueButton = ensureElement<HTMLButtonElement>('.basket__button', container)


    this.continueButton.addEventListener('click', () => {
      events.emit('order:open')
    })


  }

  render(data: Partial<IBasket>): HTMLElement {
    this.basketList.innerHTML = '';
    const items = data.items ?? [];
    const total = data.total ?? 0;
    items.forEach(item => this.basketList.appendChild(item));
    this.setText(this.total, `${total} синапсов`);
    return this.container;
  }

  setEmptyMessage(data: IProductItem[]): void {
    if (data.length === 0) {
      this.basketList.innerHTML = `<li style='list-style: none'>Корзина пуста</li>`;
    }
  }

  setTotal(total: number): void {

    this.total.textContent = `${total} синапсов`
  }



}