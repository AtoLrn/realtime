import { inject, injectable } from "inversify"
import { TYPES } from "../infrastructure";
import { Quiz } from "../entities/quiz.entity";
import { QuizRepository } from "../repositories/quiz.repository";

export interface IQuizUseCase {
    createQuiz(props: QuizUseCase.Create): Promise<Quiz>
    getAllQuiz(): Promise<Quiz[]>
    getQuizById(id: number): Promise<Quiz>
}

@injectable()
export class QuizUseCase implements IQuizUseCase {
    @inject(TYPES.IQuizRepository) private quizRepository: QuizRepository;

    async createQuiz({ name }: QuizUseCase.Create): Promise<Quiz> {
        const quiz = await this.quizRepository.createQuiz(name)

        return quiz
    }

    public async getAllQuiz(): Promise<Quiz[]> {
        return await this.quizRepository.getQuiz()
    }

    public async getQuizById(id: number): Promise<Quiz> {
        return await this.quizRepository.getQuizById(id)
    }
}

export namespace QuizUseCase {
    export interface Create {
        name: string
    }
}
