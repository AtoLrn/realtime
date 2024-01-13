import { User } from "./user.entity";

export class Room {
    users: User[] = []
    
    constructor(public id: string) {}

    add(user: User) {
        this.users.push(user)
    }
}