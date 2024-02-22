import { inject, injectable } from "inversify"
import { TYPES } from "../infrastructure";
import { Quiz } from "../entities/quiz.entity";
import { QuizRepository } from "../repositories/quiz.repository";
import {Question} from "../entities/question.entity";
import {AnswerRepository} from "../repositories/answer.repository";

export interface IQuizUseCase {
    createQuiz(props: QuizUseCase.Create): Promise<Quiz>
    getAllQuiz(): Promise<Quiz[]>
    getQuizById(id: number): Promise<Quiz>
}

@injectable()
export class QuizUseCase implements IQuizUseCase {
    @inject(TYPES.IQuizRepository) private quizRepository: QuizRepository;
    @inject(TYPES.IAnswerRepository) private answerRepository: AnswerRepository;

    async createQuiz({ name }: QuizUseCase.Create): Promise<Quiz> {
        const quiz = await this.quizRepository.createQuiz(name)

        return quiz
    }

    public async getAllQuiz(): Promise<Quiz[]> {
        return await this.quizRepository.getQuiz()
    }

    public async getQuizById(id: number): Promise<Quiz> {
        const quiz = await this.quizRepository.getQuizById(id)

        for(let i=0; i <= quiz.questions.length - 1; i++) {
            quiz.questions[i].answers = await this.answerRepository.getAnswerFromQuestion(quiz.questions[i].id)
        }

        return quiz
    }
}

export namespace QuizUseCase {
    export interface Create {
        name: string
    }
}
