import { ensureElement } from "../../utils/utils";
import { IActions } from "./Card";
import { Component } from "./Component";

interface ICardBasket {
  title: string;
  price: number;
  index: number;
}

export class CardBasket extends Component<ICardBasket> {
  protected _button: HTMLElement;
  protected _price: HTMLElement;
  protected _title: HTMLElement;
  protected _index: HTMLElement;

  constructor(container: HTMLElement, actions?: IActions) {
    super(container);

    this._title = ensureElement<HTMLElement>('.card__title', container);
    this._price = ensureElement<HTMLElement>('.card__price', container);
    this._index = ensureElement<HTMLElement>('.basket__item-index', container);
    this._button = ensureElement<HTMLElement>('.card__button', container);



  if (actions?.onClick) {
      if (this._button) {
          container.removeEventListener('click', actions.onClick);
          this._button.addEventListener('click', actions.onClick);
      } 
    }
  }

  set title(value: string) {
    this.setText(this._title, value)
  }




  set index(value: number) {
    this.setText(this._index, value)
  }



  set price(value: string) {

    if (value === null) {
      this.setText(this._price, `Бесценно`)

    }

    else {
      this.setText(this._price, `${value} синапсов`)
    }
  }
}