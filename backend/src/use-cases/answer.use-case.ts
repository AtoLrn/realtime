import { inject, injectable } from "inversify"
import { TYPES } from "../infrastructure";
import {Answer} from "../entities/answer.entity";
import {AnswerRepository} from "../repositories/answer.repository";

export interface IAnswerUseCase {
    createAnswer(props: AnswerUseCase.Create): Promise<Answer>
}

@injectable()
export class AnswerUseCase implements IAnswerUseCase {
    @inject(TYPES.IAnswerRepository) private answerRepository: AnswerRepository;

    async createAnswer({ content, isRight, questionId }: AnswerUseCase.Create): Promise<Answer> {
        const answer = await this.answerRepository.createAnswer(content, isRight, questionId)

        return answer
    }
}

export namespace AnswerUseCase {
    export interface Create {
        content: string
        isRight: boolean
        questionId: number
    }
}
