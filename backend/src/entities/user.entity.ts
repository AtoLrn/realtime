import { Socket } from "./socket.entity";

export class User {
    constructor(public username: string, public email: string, public password: string, public isAdmin: boolean) {}
}
