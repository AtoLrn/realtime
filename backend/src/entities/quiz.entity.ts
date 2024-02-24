import { Question } from "./question.entity";

export class Quiz {
    constructor(public name: string, public questions?: Question[]) {}
}
