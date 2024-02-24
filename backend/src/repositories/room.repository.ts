import { inject, injectable } from "inversify";
import { Room } from "../entities/room";
import { Awaitable } from "../utils/awaitable";
import { TYPES } from "../infrastructure";
import { IQuizRepository } from "./quiz.repository";

export interface IRoomRepository {
    get(id: string): Awaitable<Room>
    getAll(): Awaitable<Room[]>
    save(channel: Room): Awaitable<boolean>
}

@injectable()
export class RoomRepository implements IRoomRepository {
    @inject(TYPES.IQuizRepository) private quizRepository: IQuizRepository;
    rooms: Room[] = []
    
    get(id: string): Awaitable<Room> {
        const room = this.rooms.find((storedRoom) => storedRoom.id === id)


        return room
    }

    getAll() {
        return this.rooms
    }

    save(room: Room): Awaitable<boolean> {
        this.rooms.push(room)
        return true
    }
}