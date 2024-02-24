import { Quiz } from "./quiz.entity";
import { User } from "./user.entity";

export class Room {
    users: User[] = []
    startTime: number = undefined
    
    constructor(public id: string, public quiz: Quiz) {}

    start() {
        this.startTime = Date.now()
    }

    add(user: User) {
        this.users.push(user)
    }
}