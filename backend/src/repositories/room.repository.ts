import { injectable } from "inversify";
import { Room } from "../entities/room";
import { Awaitable } from "../utils/awaitable";

export interface IRoomRepository {
    get(id: string): Awaitable<Room>
    getAll(): Awaitable<Room[]>
    save(channel: Room): Awaitable<boolean>
}

@injectable()
export class RoomRepository implements IRoomRepository {
    rooms: Room[] = []
    
    get(id: string): Awaitable<Room> {
        const room = this.rooms.find((storedRoom) => storedRoom.id === id)


        return room
    }

    getAll() {
        return this.rooms
    }

    save(channel: Room): Awaitable<boolean> {
        this.rooms.push(channel)
        return true
    }
}