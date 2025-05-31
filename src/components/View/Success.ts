import { ensureElement } from "../../utils/utils";
import { Component } from "./Component";

interface ISuccess {
    total: number;
}

export class Success extends Component<ISuccess> {
    _total: HTMLElement
    _button: HTMLButtonElement

    constructor(container: HTMLElement) {
        super(container)

        this._total = ensureElement<HTMLElement>('.order-success__description', this.container)
        this._button = ensureElement<HTMLButtonElement>('.order-success__close', this.container)
    }

    setTotal(total: number) {
        this._total.textContent = `Списано ${total} синапсов`
    }
}