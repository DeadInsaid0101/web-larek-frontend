import { IProductItem } from "../../types";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/events";
import { Card } from "./Card";


export class CardPreview extends Card {
    _description: HTMLElement;
    _cardButton: HTMLButtonElement

    constructor(container: HTMLElement, events?: IEvents) {
        super(container, events)

        this._description = ensureElement<HTMLElement>('.card__text', container)
        this._cardButton = ensureElement<HTMLButtonElement>('.card__button', container)


    }

    render(data?: Partial<IProductItem>): HTMLElement {
        super.render(data);
        this._description.textContent = data.description
        return this.container
    }
}