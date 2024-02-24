import { injectable } from "inversify";
import { prisma } from "../database";
import { Quiz } from "../entities/quiz.entity";
import { Awaitable } from "../utils/awaitable";

export interface IQuizRepository {
    createQuiz(name: string): Awaitable<Quiz>
    getQuiz(): Awaitable<Quiz[]> 
    getQuizById(quizId: number): Awaitable<Quiz>
}

@injectable()
export class QuizRepository implements IQuizRepository {
    async createQuiz(name: string): Promise<Quiz> {
        const quiz = new Quiz(name)

        const dbQuiz = await prisma.quiz.create({
            data: {
                name: quiz.name,
            }
        })

        return dbQuiz
    }

    async getQuiz(): Promise<Quiz[]> {
        return await prisma.quiz.findMany()
    }

    async getQuizById(quizId: number): Promise<Quiz> {
        const dbQuiz = await prisma.quiz.findUnique({
            where: {
                id: quizId
            },
            include: {
                questions: true
            }
        })

        return dbQuiz
    }
}
