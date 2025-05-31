import { IEvents } from "../base/events";
import { Component } from "./Component";
import { ensureElement } from "../../utils/utils";

interface IPage {
    catalog: HTMLElement[]
}

export class Page extends Component<IPage> {
    _counter: HTMLElement
    _catalog: HTMLElement
    _wrapper: HTMLElement
    _basket: HTMLButtonElement

    constructor(container: HTMLElement, events?: IEvents) {
        super(container)
        this._catalog = ensureElement<HTMLElement>('.gallery');
        this._counter = ensureElement<HTMLElement>('.header__basket-counter');
        this._wrapper = ensureElement<HTMLElement>('.page__wrapper');
        this._basket = ensureElement<HTMLButtonElement>('.header__basket');

    }

    set catalog(items: HTMLElement[]) {
        items.forEach(item => this._catalog.appendChild(item))
    }

    set counter(value: number) {
        this._counter.textContent = String(value)
    }

    set locked(value: boolean) {
        if (value) {
            this._wrapper.classList.add('page__wrapper_locked');
        }

        else {
            this._wrapper.classList.remove('page__wrapper_locked');
        }
    }
}