import { ensureElement } from "../../utils/utils";
import { IActions } from "./Card";

import { Component } from "./Component";

interface ISuccess {
    total: number;
}

export class Success extends Component<ISuccess> {
    protected _total: HTMLElement
    protected _button: HTMLButtonElement

    constructor(container: HTMLElement, actions: IActions) {
        super(container)

        this._total = ensureElement<HTMLElement>('.order-success__description', this.container)
        this._button = ensureElement<HTMLButtonElement>('.order-success__close', this.container)

        this._button.addEventListener('click', actions.onClick)

    }

    setTotal(total: number) {
        this._total.textContent = `Списано ${total} синапсов`
    }
}