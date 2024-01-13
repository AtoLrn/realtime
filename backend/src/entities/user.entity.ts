import { Socket } from "./socket.entity";

export class User {
    constructor(public id: string, public socket: Socket) {}
}