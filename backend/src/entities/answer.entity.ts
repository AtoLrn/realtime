import { Socket } from "./socket.entity";

export class Answer {
    constructor(public content: string, public isRight: boolean, public questionId: number) {}
}
