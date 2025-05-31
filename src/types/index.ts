export interface IProductItem {
  id: string,
  title: string,
  description: string,
  category: string,
  image: string,
  price: number | null,
}

export interface IOrder extends IOrderForm {

total: number,
items: string[],
}

export interface IOrderForm {
  payment: string,
  address: string,
phone: string,
email: string,
}

export interface IOrderResult {
  id: string,    
  total: number,
}

export interface IAppDataState {
  catalog: IProductItem[];
  basket: IProductItem[];
 order: IOrder;
 // preview: IProductItem | null;
}

export type FormErrors = Partial<Record<keyof IOrder, string>>;