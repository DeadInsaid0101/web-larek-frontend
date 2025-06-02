import { IProductItem, IAppDataState, FormErrors, IOrder, IOrderResult } from "../../types"

import { Model } from "./Model"

export class AppData extends Model<IAppDataState> {
    catalog: IProductItem[] = [];
    basket: IProductItem[] = [];
    formErrors: FormErrors = {};
    order: IOrder = {
        payment: 'card',
        email: '',
        phone: '',
        address: '',
    };



    setCatalog(items: IProductItem[]): void {
        this.catalog = items
        this.emitChanges('items:changed', this.catalog);
    }

    setProductToBasket(item: IProductItem): void {
        this.basket.push(item);
        this.events.emit('basket:changed', this.basket);
    }

    removeProductFromBasket(item: IProductItem) {
        const index = this.basket.indexOf(item);
        if (index >= 0) {
            this.basket.splice(index, 1);
        }
    }

    getTotal(): number {
        return this.basket.reduce((sum, i) => sum + (i.price || 0), 0)

    }


    validateClear(): void {
        this.order.email = '';
        this.order.phone = '';
        this.order.address = '';
        this.order.payment = 'card';
    }


    setPayment(field: keyof IOrder, value: string) {
        this.order[field] = value;
        this.events.emit('payment:save', this.order);
    }

    setOrderField(field: keyof IOrder, value: string) {
        this.order[field] = value;

        if (this.validateOrder()) {
            this.events.emit('order:ready', this.order);
        }
    }

    setContactsField(field: keyof IOrder, value: string) {
        this.order[field] = value;

        if (this.validateContacts()) {
            this.events.emit('order:ready', this.order);
        }
    }


    validateOrder() {
        const errors: typeof this.formErrors = {};
        if (!this.order.address) {
            errors.address = 'Необходимо указать адрес';
        }
        if (!this.order.payment) {
            errors.payment = 'Необходимо указать способ оплаты';
        }
        this.formErrors = errors;
        this.events.emit('formErrors:change', this.formErrors);
        return Object.keys(errors).length === 0;
    }

    validateContacts() {
        const errors: typeof this.formErrors = {};
        if (!this.order.email) {
            errors.email = 'Необходимо указать почту';
        }
        if (!this.order.phone) {
            errors.phone = 'Необходимо указать телефон';
        }
        if (!this.order.phone && !this.order.email) {
            errors.email = ''
            errors.phone = 'Необходимо указать телефон и почту';
        }
        this.formErrors = errors;
        this.events.emit('formErrors:change', this.formErrors);
        return Object.keys(errors).length === 0;
    }

    getOrder(): IOrder {
        return this.order;
    }

    getBasket(): IProductItem[] {
        return this.basket;
    }



    clearBasket(): void {
        this.basket = []
    }



}


