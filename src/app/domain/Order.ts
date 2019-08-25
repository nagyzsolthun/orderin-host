import OrderItem from "./OrderItem";

export default class Order {
    id: string;
    counter: string;
    orderItems: OrderItem[];
    tableName: Map<string,string>;

    static fromJson(json: any): Order {
        const result = new Order();
        result.id = json.id;
        result.counter = json.counter;
        result.orderItems = json.orderItems.map(OrderItem.fromJson);
        result.tableName = new Map(Object.entries(json.tableName));
        return result;
    }
}