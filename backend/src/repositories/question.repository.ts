import { injectable } from "inversify";
import { prisma } from "../database";
import { Question } from "../entities/question.entity";

export interface IQuestionRepository {
    createQuestion(content: string, quizId: number): Promise<Question> | Question
    getQuestionById(questionId: number): Promise<Question> | Question
    deleteQuestion(questionId: number): Promise<true>
}

@injectable()
export class QuestionRepository implements IQuestionRepository {
    async createQuestion(content: string, quizId: number): Promise<Question> {
        const question = new Question(content, quizId)

        const dbQuestion = await prisma.question.create({
            data: {
                content: question.content,
                quizId: question.quizId
            }
        })

        return dbQuestion
    }

    async getQuestionById(questionId: number): Promise<Question> {
        const dbQuestion = await prisma.question.findUnique({
            where: {
                id: questionId
            },
            include: {
                answers: true
            }
        })

        return dbQuestion
    }

    async deleteQuestion(questionId: number): Promise<true> {
        await prisma.question.delete({
            where: {
                id: questionId 
            }
        })

        return true
    }
}
