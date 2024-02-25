import { inject, injectable } from "inversify";
import { Awaitable } from "../utils/awaitable";
import { TYPES } from "../infrastructure";
import { IQuizRepository } from "./quiz.repository";
import { RoomAnswer } from "../entities/roomAnswer.entity";

export interface IRoomAnswerRepository {
    getAll(): Awaitable<RoomAnswer[]>
    getAllByRoomId(roomId: string): Awaitable<RoomAnswer[]>
    save(room: RoomAnswer): Awaitable<boolean>
}

@injectable()
export class RoomAnswerRepository implements IRoomAnswerRepository {
    @inject(TYPES.IQuizRepository) private quizRepository: IQuizRepository;
    roomsAnswer: RoomAnswer[] = []


    getAll() {
        return this.roomsAnswer
    }

    getAllByRoomId(roomId: string) {
        return this.roomsAnswer.filter((room) => room.roomId === roomId)
    }

    save(room: RoomAnswer): Awaitable<boolean> {
        this.roomsAnswer.push(room)
        return true
    }
}