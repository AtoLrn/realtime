import { injectable } from "inversify";
import { v4 as uuidv4 } from 'uuid';

export interface IUuidService {
    generateUuid(): string
}

@injectable()
export class UuidRandomService implements IUuidService {
    generateUuid(): string {
        return uuidv4()
    }
    
}