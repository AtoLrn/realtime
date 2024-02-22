import { injectable } from "inversify";
import { prisma } from "../database";
import { Quiz } from "../entities/quiz.entity";

export interface IQuizRepository {
    createQuiz(name: string): Promise<Quiz> | Quiz
    getQuiz(): Promise<Quiz[]> | Quiz[]
    getQuizById(quizId: number): Promise<Quiz> | Quiz
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
