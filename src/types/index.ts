export interface IProductItem {
  id: string,
  name: string,
  description: string,
  category: string,
  img: string,
  price: number | null,
}

export interface IOrder {
payment: string,
address: string,
phone: string,
email: string,
total: string | number,
items: string[],
}

export interface IOrderResult {
  id: string,    
  total: number,
}

export interface IAppDataState {
  catalog: IProductItem[];
  basket: IProductItem[];
  order: IOrder;
  preview: IProductItem | null;
  total: number;
}
