export default class OrderItem {
    productId: string;
    portionId: string;
    productName: Map<string,string>;
    portionName: Map<string,string>;
    price: Map<string,number>;
    count: number;

    static fromJson(json: any): OrderItem {
        const result = new OrderItem();
        result.productId = json.productId;
        result.portionId = json.portionId;
        result.productName = new Map(Object.entries(json.productName));
        result.portionName = new Map(Object.entries(json.portionName));
        result.price = new Map(Object.entries(json.price));
        result.count = json.count;
        return result;
    }
}