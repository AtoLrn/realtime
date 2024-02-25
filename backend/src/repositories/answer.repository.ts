import { injectable } from "inversify";
import { prisma } from "../database";
import {Answer} from "../entities/answer.entity";
import { Awaitable } from "../utils/awaitable";

export interface IAnswerRepository {
    get(answerId: number): Awaitable<Answer>
    createAnswer(content: string, isRight: boolean, questionId: number): Promise<Answer> | Answer
    getAnswerFromQuestion(questionId: number): Promise<Answer[]>
    deleteAnswer(answerId: number): Promise<true>
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

    async get(answerId: number): Promise<Answer> {
        return await prisma.answer.findFirst({
            where: {
                id: answerId
            }
        })
    }

    async deleteAnswer(answerId: number): Promise<true> {
        await prisma.answer.delete({
            where: {
                id: answerId
            }
        })

        return true
    }
}
