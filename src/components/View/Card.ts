import { Component } from "./Component";
import { IProductItem } from "../../types";
import { IEvents } from "../base/events";
import { ensureElement } from "../../utils/utils";


export class Card extends Component<IProductItem> {
    _title: HTMLElement
    _category: HTMLElement
    _image: HTMLImageElement
    _price: HTMLElement
    _categoryColor = <Record<string, string>>{
        'софт-скил': 'soft',
        'другое': 'other',
        'дополнительное': 'additional',
        'кнопка': 'button',
        'хард-скил': 'hard'
    }

    constructor(container: HTMLElement, events?: IEvents) {
        super(container)
        this._title = ensureElement<HTMLElement>(`.card__title`, container);
        this._category = ensureElement<HTMLElement>(`.card__category`, container);
        this._image = ensureElement<HTMLImageElement>(`.card__image`, container);
        this._price = ensureElement<HTMLElement>(`.card__price`, container);
    }

    set title(value: string) {
        this._title.textContent = value
    }

    set category(value: string) {
        this._category.textContent = value
        this._category.className = `card__category card__category_${this._categoryColor[value]}`
    }

    set image(value: string) {
        this._image.src = value
    }

    set price(value: number | null) {
        this._price.textContent = value === null ? 'Бесценно' : `${value} синапсов`
    }
}