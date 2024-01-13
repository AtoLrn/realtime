import { injectable } from "inversify";
import { v4 as uuidv4 } from 'uuid';

export interface IUuid {
    generateUuid(): string
}

@injectable()
export class UuidRandomService implements IUuid {
    generateUuid(): string {
        return uuidv4()
    }
    
}