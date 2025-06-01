
import { IOrder } from "../../types";
import { ensureAllElements } from "../../utils/utils";
import { IEvents } from "../base/events";
import { Form } from "./Form";

export class Order extends Form<IOrder> {
    protected _buttons: HTMLButtonElement[]

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);

        this._buttons = ensureAllElements<HTMLButtonElement>('.button_alt', container);

        this._buttons.forEach(button => {
            button.addEventListener('click', () => {

                events.emit('payment:change', button)

            });
        })
    }

    set payment(name: string) {
        this._buttons.forEach(button => {
            this.toggleClass(button, 'button_alt-active', button.name === name);
        });
    }

    set address(value: string) {
        (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
    }

}

