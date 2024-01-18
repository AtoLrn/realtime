import { injectable } from "inversify";
import { User } from "../entities/user.entity";
import { prisma } from "../database";

export interface IUserRepository {
    createUser(username: string, email: string, password: string): Promise<User> | User
    getUsers(): Promise<User[]> | User[]
    getUserById(userId: number): Promise<User> | User 
    getUserByUsername(username: string): Promise<User> | User 
    getUserByEmail(email: string): Promise<User> | User 
}

@injectable()
export class UserRepository implements IUserRepository {
    async createUser(username: string, email: string, password: string): Promise<User> {
        const user = new User(username, email, password, false)

        const dbUser = await prisma.user.create({
            data: {
                username: user.username,
                email: user.email,
                password: user.password
            }
        })

        return dbUser
    }

    async getUsers(): Promise<User[]> {
        return await prisma.user.findMany()
    }

    async getUserById(userId: number): Promise<User> {
        const dbUser = await prisma.user.findUnique({
            where: {
                id: userId
            }
        })

        return dbUser
    }

    async getUserByUsername(username: string): Promise<User> {
        const dbUser = await prisma.user.findUnique({
            where: {
                username: username
            }
        })

        return dbUser
    }

    async getUserByEmail(email: string): Promise<User> {
        const dbUser = await prisma.user.findUnique({
            where: {
                email: email
            }
        })

        return dbUser
    }
}
