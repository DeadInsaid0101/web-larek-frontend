import { IProductItem, IOrder, IOrderResult } from "../../types";
import { Api, ApiListResponse } from "./api";

export class LarekApi extends Api {
    cdn: string

    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options)
        this.cdn = cdn
    }

    getProductCatalog(): Promise<IProductItem[]> {
        return this.get('/product')
            .then((data: ApiListResponse<IProductItem>) => {
                return data.items.map(item => ({
                    ...item,
                    image: this.cdn + item.image
                }))
            })

    }
    orderProducts(order: IOrder): Promise<IOrderResult> {

        return this.post('/order', order).then(
            (data: IOrderResult) => {
                return data
            }
        );
    }
}