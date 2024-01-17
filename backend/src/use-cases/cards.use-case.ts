import { inject, injectable } from "inversify"
import { TYPES } from "../infrastructure";
import { UserRepository } from "../repositories/user.repository";
import { IRoomRepository } from "../repositories/room.repository";
import { Room } from "../entities/room";
import { IUuid } from "../services/uuid.services";


export interface ICardsUseCase {
    getRooms(): Promise<Room[]>
    handleQuestions(): Promise<any>
}

@injectable()
export class CardsUseCase implements ICardsUseCase {
    @inject(TYPES.IRoomRepository) private roomRepository: IRoomRepository;
    @inject(TYPES.UuidService) private uuidService: IUuid;

    async handleQuestions(): Promise<any> {
        const id = this.uuidService.generateUuid()

        const room = new Room(id)

        await this.roomRepository.save(room)

        return room
    }

    async getRooms(): Promise<Room[]> {
        return await this.roomRepository.getAll()
    }

    @inject(TYPES.IUserRepository) private userRepository: UserRepository;
    
    public async getAllCards(tag?: string) {
        const user = await this.userRepository.getUserById(1)
    }

    public async createCard({ question, answer, tag }: CardsUseCase.Create){
        const user = await this.userRepository.getUserById(1)

    }

    public async getCardForDate(date: Date = new Date()) {
        const user = await this.userRepository.getUserById(1)

        }

    public async answerCard(cardId: string, isValid: boolean) {


    }
    
}

export namespace CardsUseCase {
    export interface Create {
        question: string
        answer: string,
        tag?: string
    }
}
