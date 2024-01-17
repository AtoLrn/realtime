import { inject, injectable } from "inversify"
import { TYPES } from "../infrastructure";
import { UserRepository } from "../repositories/user.repository";
import { User } from "../entities/user.entity";
import { PasswordService } from "../services/password.services";
import { JsonWebTokenService } from "../services/jwt.services";

export interface IUsersUseCase {
    createUser(props: UsersUseCase.Create): Promise<User>
    loginUser(props: UsersUseCase.Login): Promise<string>
}

@injectable()
export class UsersUseCase implements IUsersUseCase {
    @inject(TYPES.IUserRepository) private userRepository: UserRepository;
    @inject(TYPES.IPassword) private passwordService: PasswordService;
    @inject(TYPES.IJsonWebToken) private jsonWebTokenService: JsonWebTokenService;

    async createUser({ email, password }: UsersUseCase.Create): Promise<User> {
        const existingUser = await this.userRepository.getUserByEmail(email)

        if (existingUser) {
            throw new Error('User already exist with this email')
        }

        const hashedPassword = await this.passwordService.encrypt(password)

        const user = await this.userRepository.createUser(email, hashedPassword)

        return user
    }

    async loginUser({ email, password }: UsersUseCase.Login): Promise<string> {
        const user = await this.userRepository.getUserByEmail(email)

        if (!user) {
            throw new Error('No user with this email')
        }

        const checkPassword = await this.passwordService.validate(password, user.password)

        if (!checkPassword) {
            throw new Error('Wrong password')
        }

        return this.jsonWebTokenService.generate(user)
    }
}

export namespace UsersUseCase {
    export interface Create {
        email: string
        password: string,
    }

    export interface Login {
        email: string
        password: string,
    }
}
