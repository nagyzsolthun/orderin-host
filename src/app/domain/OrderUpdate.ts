export default class OrderUpdate {
    orderId: string;
    state: string;
    host: string;

    static fromJson(json: any): OrderUpdate {
        const result = new OrderUpdate();
        result.orderId = json.orderId;
        result.state = json.state;
        result.host = json.host;
        return result;
    }
}