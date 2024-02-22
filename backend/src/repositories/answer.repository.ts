import { injectable } from "inversify";
import { prisma } from "../database";
import {Answer} from "../entities/answer.entity";

export interface IAnswerRepository {
    createAnswer(content: string, isRight: boolean, questionId: number): Promise<Answer> | Answer
    getAnswerFromQuestion(questionId: number): Promise<Answer[]>
}

@injectable()
export class AnswerRepository implements IAnswerRepository {
    async createAnswer(content: string, isRight: boolean, questionId: number): Promise<Answer> {
        const answer = new Answer(content, isRight, questionId)

        const dbAnswer = await prisma.answer.create({
            data: {
                content: answer.content,
                isRight: answer.isRight,
                questionId: answer.questionId
            }
        })

        return dbAnswer
    }

    async getAnswerFromQuestion(questionId: number): Promise<Answer[]> {
        const dbAnswers = await prisma.answer.findMany({
            where: {
                questionId: questionId
            }
        })

        return dbAnswers
    }
}
