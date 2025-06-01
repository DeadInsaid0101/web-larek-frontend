export interface IProductItem {
  id: string,
  title: string,
  description?: string,
  category: string,
  image: string,
  price: number | null,
}

export interface IOrder {
  payment: string,
  address: string,
  phone: string,
  email: string,

}


export interface IOrderResult extends IOrder {
  items: string[]
  total: number,
}

export interface IAppDataState {
  catalog: IProductItem[];
  basket: IProductItem[];
  order: IOrder;
}

export type FormErrors = Partial<Record<keyof IOrder, string>>;

