export default class User {
    id: string;
    givenName: string;

    static fromJson(json: any): User {
        const result = new User();
        result.id = json.id;
        result.givenName = json.givenName;
        return result;
    }
}