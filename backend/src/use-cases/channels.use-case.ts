import { inject, injectable } from "inversify";
import { Socket } from "../entities/socket.entity";
import { User } from "../entities/user.entity";
import { Awaitable } from "../utils/awaitable";
import { TYPES } from "../infrastructure";
import { IUuidService } from "../services/uuid.services";
import { IRoomRepository } from "../repositories/room.repository";
import { Room } from "../entities/room";

export interface IRoomsUseCase {
    getRooms(): Awaitable<Room[]>
    start(roomId: string): Awaitable<Room>
    canJoin(roomId: string): Awaitable<boolean>
}

export namespace IRoomsUseCase {
    export interface Start {
        roomId: string
    }
}

@injectable()
export class RoomsUseCase implements IRoomsUseCase {
    @inject(TYPES.IRoomRepository) private roomRepository: IRoomRepository;
    @inject(TYPES.IUuidService) private uuidService: IUuidService;

    //save(socket: Socket): Awaitable<User> {
        //const user = new User(this.uuidService.generateUuid(), socket)

        //return user
    //}


    //async join(channelId: string, user: User): Promise<boolean> {
        //await this.roomRepository.save(new Room(channelId))

        //const room = await this.roomRepository.get(channelId)

        //user.socket.join(channelId)
        //room.add(user)

        //return true
    //}

    getRooms(): Awaitable<Room[]> {
        return this.roomRepository.getAll()
    }

    async canJoin(roomId: string): Promise<boolean> {
        const room = await this.roomRepository.get(roomId)

        return !!room
    }

    async start(roomId: string): Promise<Room> {
        const room = await this.roomRepository.get(roomId)

        return room
    }
}
