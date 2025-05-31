import { IProductItem, IAppDataState, FormErrors, IOrder, IOrderForm } from "../../types"
import { IEvents } from "../base/events"
import { IBasketItem } from "../View/Basket";
import { Model } from "./Model"

export class AppData extends Model<IAppDataState> {
    catalog: IProductItem[] = [];
    basket: IBasketItem[] = [];
    formErrors: FormErrors = {};
    order: IOrder = {
        payment: 'card',
        email: '',
        phone: '',
        items: [],
        address: '',
        total: null,
    };


    setCatalog(items: IProductItem[]): void {
        this.catalog = items
    }

    setProductToBasket(item: IProductItem): void {
        const basketItem: IBasketItem = {
            ...item,
            basketItemId: Math.random().toString(30).slice(2)
        };
        this.basket.push(basketItem);

    }

    removeProductToBasket(basketProductItem: IBasketItem): void {

        const arr = this.basket.filter(item => item.basketItemId !== basketProductItem.basketItemId)
        this.basket = arr
    }

    getTotal(data: IProductItem[]): number {
        return data.reduce((sum, i) => sum + (i.price || 0), 0)

    }

    setOrderField(field: keyof IOrderForm, value: string) {
        this.order[field] = value;

        if (this.validateOrder()) {
            this.events.emit('order:ready', this.order);
        }
    }

    setContactsField(field: keyof IOrderForm, value: string) {
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

    addProductIdToOrder(): void {
        this.order.items = this.basket.map(item => item.id);
    }

    clearBasket(): void {
        this.basket = []
    }


}


