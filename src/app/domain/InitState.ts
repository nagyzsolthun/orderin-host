import Venue from "./Venue";
import User from "./User";

export default class InitState {
    user: User;
    venue: Venue;

    static fromJson(json: any): InitState {
        const result = new InitState();
        result.user = User.fromJson(json.user);
        result.venue = Venue.fromJson(json.venue);
        return result;
    }
}