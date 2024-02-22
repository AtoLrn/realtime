import { inject, injectable } from "inversify"
import { TYPES } from "../infrastructure";
import {Question} from "../entities/question.entity";
import {QuestionRepository} from "../repositories/question.repository";

export interface IQuestionUseCase {
    createQuestion(props: QuestionUseCase.Create): Promise<Question>
}

@injectable()
export class QuestionUseCase implements IQuestionUseCase {
    @inject(TYPES.IQuestionRepository) private questionRepository: QuestionRepository;

    async createQuestion({ content, quizId }: QuestionUseCase.Create): Promise<Question> {
        const question = await this.questionRepository.createQuestion(content, quizId)

        return question
    }
}

export namespace QuestionUseCase {
    export interface Create {
        content: string
        quizId: number
    }
}
