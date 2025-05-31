import { IProductItem } from "../../types";
import { ensureElement, cloneTemplate, ensureAllElements } from "../../utils/utils";
import { IEvents } from "../base/events";
import { Component } from "./Component";

// types.ts
export interface IBasketItem extends IProductItem {
  basketItemId: string;  // уникальный идентификатор в корзине

}


export class Basket extends Component<IProductItem[]> {
  container: HTMLElement
  basketList: HTMLElement
  total: HTMLElement
  continueButton: HTMLButtonElement


  constructor(container: HTMLElement, events: IEvents) {
    super(container)

    this.basketList = ensureElement<HTMLElement>('.basket__list', container)
    this.total = ensureElement<HTMLElement>('.basket__price', container);
    this.continueButton = ensureElement<HTMLButtonElement>('.basket__button', container)


  }

  render(data: IBasketItem[]): HTMLElement {

    this.basketList.innerHTML = '';




    data.forEach((item, index) => {

      const li = cloneTemplate<HTMLElement>('#card-basket');
      ensureElement<HTMLElement>('.basket__item-index', li).textContent = String(index + 1);
      ensureElement<HTMLElement>('.card__title', li).textContent = item.title;
      li.dataset.basketItemId = item.basketItemId
      li.dataset.index = String(index);
      ensureElement<HTMLElement>('.card__price', li).textContent = item.price === null ? 'Бесценно' : `${item.price}`;


      li.dataset.id = item.id;

      this.basketList.appendChild(li);

    })
    return this.container;
  }

  setEmptyMessage(data: IBasketItem[]): void {
    if (data.length === 0) {
      this.basketList.innerHTML = `<li style='list-style: none'>Корзина пуста</li>`;
    }
  }

  setTotal(total: number): void {

    this.total.textContent = `${total} синапсов`
  }

  setRemoveHandler(handler: (basketItem: IBasketItem) => void, data: IBasketItem[]): void {
    const deleteBtns = this.basketList.querySelectorAll<HTMLButtonElement>('.basket__item-delete');
    deleteBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const li = btn.closest<HTMLElement>('.basket__item');

        const cid = li?.dataset.basketItemId;
        if (!cid) return;

        const basketItem = data.find(i => i.basketItemId === cid);
        if (basketItem) {
          handler(basketItem);
        }
      });
    });
  }
}