import { Answer } from "./answer.entity";
import { Question } from "./question.entity";
import { Quiz } from "./quiz.entity";

export class RoomAnswer {
    constructor(public userId: string, public roomId: string, public quiz: Quiz, public answer: Answer, public question: Question) {}
}
