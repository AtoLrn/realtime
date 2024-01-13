import { inject, injectable } from "inversify";
import { Socket } from "../entities/socket.entity";
import { User } from "../entities/user.entity";
import { Awaitable } from "../utils/awaitable";
import { TYPES } from "../infrastructure";
import { IUuid } from "../services/uuid.services";
import { IRoomRepository } from "../repositories/room.repository";
import { Room } from "../entities/room";

export interface IRoomsUseCase {
    save(socket: Socket): Awaitable<User>
    join(channelId: string, user: User): Awaitable<boolean>
    broadcast(channelId: string, message: unknown): Awaitable<boolean>
    emit(user: User, message: unknown): Awaitable<boolean>
}

@injectable()
export class RoomsUseCase implements IRoomsUseCase {
    @inject(TYPES.IRoomRepository) private roomRepository: IRoomRepository;
    @inject(TYPES.UuidService) private uuidService: IUuid;

    save(socket: Socket): Awaitable<User> {
        const user = new User(this.uuidService.generateUuid(), socket)

        return user
    }


    async join(channelId: string, user: User): Promise<boolean> {
        await this.roomRepository.save(new Room(channelId))

        const room = await this.roomRepository.get(channelId)

        user.socket.join(channelId)
        room.add(user)

        return true
    }


    broadcast(channelId: string, message: unknown): Awaitable<boolean> {
        throw new Error("Method not implemented.");
    }


    emit(user: User, message: unknown): Awaitable<boolean> {
        throw new Error("Method not implemented.");
    }
    
}