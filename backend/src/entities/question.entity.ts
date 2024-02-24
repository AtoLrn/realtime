import { Answer } from "./answer.entity";

export class Question {
    constructor(public content: string, public quizId: number,public id?: number, public answers?: Answer[]) {}
}
