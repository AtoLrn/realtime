import { inject, injectable } from "inversify"
import { TYPES } from "../infrastructure";
import { Quiz } from "../entities/quiz.entity";
import { QuizRepository } from "../repositories/quiz.repository";
import {Question} from "../entities/question.entity";
import {AnswerRepository} from "../repositories/answer.repository";
import { Room } from "../entities/room";
import { IUuidService, UuidRandomService } from "../services/uuid.services";
import { RoomRepository } from "../repositories/room.repository";

export interface IQuizUseCase {
    createQuiz(props: QuizUseCase.Create): Promise<Quiz>
    getAllQuiz(): Promise<Quiz[]>
    getQuizById(id: number): Promise<Quiz>
    startQuiz(id: number): Promise<Room>
}

@injectable()
export class QuizUseCase implements IQuizUseCase {
    @inject(TYPES.IQuizRepository) private quizRepository: QuizRepository;
    @inject(TYPES.IRoomRepository) private roomRepository: RoomRepository;
    @inject(TYPES.IAnswerRepository) private answerRepository: AnswerRepository;
    @inject(TYPES.IUuidService) private uuidService: IUuidService;

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

    public async startQuiz(id: number): Promise<Room> {
        const quiz = await this.quizRepository.getQuizById(id)

        const roomId = this.uuidService.generateUuid()

        const room = new Room(roomId, quiz)
        await this.roomRepository.save(room)

        return room
    }
}

export namespace QuizUseCase {
    export interface Create {
        name: string
    }

    export interface Start {
        id: number
    }
}
