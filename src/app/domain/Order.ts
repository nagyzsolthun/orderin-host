import OrderItem from "./OrderItem";

export default class Order {
    id: string;
    counter: string;
    tableName: Map<string,string>;
    orderItems: OrderItem[];
    state: string;
    host: string;

    static fromJson(json: any): Order {
        const result = new Order();
        result.id = json.id;
        result.counter = json.counter;
        result.tableName = new Map(Object.entries(json.tableName));
        result.orderItems = json.orderItems.map(OrderItem.fromJson);
        result.state = json.state;
        result.host = json.host;
        return result;
    }
}