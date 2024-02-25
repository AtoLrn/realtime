import { inject, injectable } from "inversify";
import { Socket } from "../entities/socket.entity";
import { User } from "../entities/user.entity";
import { Awaitable } from "../utils/awaitable";
import { TYPES } from "../infrastructure";
import { IUuidService } from "../services/uuid.services";
import { IRoomRepository } from "../repositories/room.repository";
import { Room } from "../entities/room";
import { RoomAnswer } from "../entities/roomAnswer.entity";
import { IAnswerRepository } from "../repositories/answer.repository";
import { IQuestionRepository } from "../repositories/question.repository";
import { IRoomAnswerRepository } from "../repositories/roomAnswer.repository";

export interface IRoomsUseCase {
    getRooms(): Awaitable<Room[]>
    getRoomById(id: string): Awaitable<Room>
    start(roomId: string): Awaitable<Room>
    canJoin(roomId: string): Awaitable<boolean>
    stop(roomId: string): Awaitable<Room>
    answer(props: IRoomsUseCase.Answer): Awaitable<RoomAnswer>
    getAnswers(props: IRoomsUseCase.GetAnswers): Awaitable<RoomAnswer[]>
}

export namespace IRoomsUseCase {
    export interface Start {
        roomId: string
    }

    export interface Answer {
        roomId: string
        userId: string
        questionId: number
        answerId: number
    }

    export interface GetAnswers {
        roomId: string
    }
}

@injectable()
export class RoomsUseCase implements IRoomsUseCase {
    @inject(TYPES.IRoomRepository) private roomRepository: IRoomRepository;
    @inject(TYPES.IAnswerRepository) private answerRepository: IAnswerRepository;
    @inject(TYPES.IQuestionRepository) private questionRepository: IQuestionRepository;
    @inject(TYPES.IRoomAnswerRepository) private roomAnswerRepository: IRoomAnswerRepository;

    getRooms(): Awaitable<Room[]> {
        return this.roomRepository.getAll()
    }

    async answer({ userId, roomId, questionId, answerId}: IRoomsUseCase.Answer): Promise<RoomAnswer> {
        const [ room, answer, question ] = await Promise.all([
            this.roomRepository.get(roomId),
            this.answerRepository.get(answerId),
            this.questionRepository.get(questionId)
        ])

        const roomAnswer = new RoomAnswer(userId, roomId, room.quiz, answer, question)

        await this.roomAnswerRepository.save(roomAnswer)

        return roomAnswer
    }

    async getAnswers({ roomId }: IRoomsUseCase.GetAnswers): Promise<RoomAnswer[]> {
        return await this.roomAnswerRepository.getAllByRoomId(roomId)
    }

    async getRoomById(id: string): Promise<Room> {
        return await this.roomRepository.get(id)
    }

    async canJoin(roomId: string): Promise<boolean> {
        const room = await this.roomRepository.get(roomId)

        return !!room
    }

    async start(roomId: string): Promise<Room> {
        const room = await this.roomRepository.get(roomId)

        room.start()

        return room
    }

    async stop(roomId: string): Promise<Room> {
        const room = await this.roomRepository.get(roomId)

        room.stop()

        return room
    }
}
