import { injectable } from "inversify";
import { compare, hash } from 'bcryptjs'

export interface IPassword {
    encrypt(password: string): Promise<string>
    validate(password: string, encrypted: string): Promise<boolean>
}

@injectable()
export class PasswordService implements IPassword {
	async encrypt(password: string) {
		return hash(password, 10)
	}
    
	async validate(password: string, encrypted: string) {
		return compare(password, encrypted)
	}
}
