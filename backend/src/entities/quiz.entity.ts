import {Question} from "./question.entity";
import { Socket } from "./socket.entity";

export class Quiz {
    constructor(public name: string, public questions?: Question[]) {}
}
