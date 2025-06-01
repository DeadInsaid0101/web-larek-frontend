import { IProductItem } from "../../types";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/events";
import { Card, IActions } from "./Card";



export class CardPreview extends Card {
    protected _description: HTMLElement;
    cardButton: HTMLButtonElement

    constructor(container: HTMLElement, events?: IEvents, actions?: IActions) {
        super(container, events)

        this._description = ensureElement<HTMLElement>('.card__text', container)
        this.cardButton = ensureElement<HTMLButtonElement>('.card__button', container)


        if (actions?.onClick) {
            this.cardButton.addEventListener('click', actions.onClick);
        }

    }

    set description(value: string) {
        this.setText(this._description, value);
    }

    render(data?: Partial<IProductItem>): HTMLElement {
        super.render(data);
        if (data.description !== undefined) {
            this.description = data.description;
        }
        else {
            this.description = ''
        }
        return this.container
    }
}