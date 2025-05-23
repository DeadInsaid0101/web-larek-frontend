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

export interface IModal {
  open(): void;
  close(): void;
  render(content: HTMLElement): void;
}