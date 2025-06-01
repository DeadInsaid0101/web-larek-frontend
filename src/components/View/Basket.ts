import { IProductItem } from "../../types";
import { ensureElement, cloneTemplate, ensureAllElements } from "../../utils/utils";
import { IEvents } from "../base/events";
import { Component } from "./Component";



export class Basket extends Component<unknown> {
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

  render(items: HTMLElement[]): HTMLElement {
    this.basketList.innerHTML = '';
    items.forEach(item => this.basketList.appendChild(item));
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

  setRemoveHandler(handler: (productId: string) => void, data: IProductItem[]): void {
    const deleteButtons = this.basketList.querySelectorAll<HTMLButtonElement>('.basket__item-delete');

    deleteButtons.forEach((button, idx) => {
      button.addEventListener('click', () => {
        const productId = data[idx].id;
        handler(productId);
      });
    });
  }
}