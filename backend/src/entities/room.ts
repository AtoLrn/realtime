import { Quiz } from "./quiz.entity";

export class Room {
    public status = 'IDLE'
    public startTime: number = undefined
    
    constructor(public id: string, public quiz: Quiz) {}

    start() {
        this.startTime = Date.now()
        this.status = 'RUNNING'
    }

    stop() {
        this.status = 'STOPPED'
    }
}