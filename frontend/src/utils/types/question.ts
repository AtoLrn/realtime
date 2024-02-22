import {Answer} from "./answer";

export interface Question {
    id: string,
    content: string,
    answers?: Answer[],
    selectedOne?: string
}
