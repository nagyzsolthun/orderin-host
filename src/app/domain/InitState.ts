import Venue from "./Venue";

export default class InitState {
    venue: Venue;

    static fromJson(json: any): InitState {
        const result = new InitState();
        result.venue = Venue.fromJson(json.venue);
        return result;
    }
}