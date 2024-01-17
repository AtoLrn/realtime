import { injectable } from "inversify";
import jwt from 'jsonwebtoken'
import { User } from "../entities/user.entity";
import dotenv from "dotenv"

dotenv.config()

export interface IJsonWebToken {
    generate(user: User): string
}

@injectable()
export class JsonWebTokenService implements IJsonWebToken {
	generate(user: User): string {
        delete user.password

		return jwt.sign(user, process.env.JWT_SECRET_KEY, {
            algorithm: "HS256"
        })
	}
}
