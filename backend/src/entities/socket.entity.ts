import { Awaitable } from "../utils/awaitable";

export class Socket {
    constructor(
        public join: (roomId: string) => Awaitable<void>,
        public emit: (event: string, msg: Object) => Awaitable<boolean>,
        public on: (event: string, callback: (msg: Object) => Awaitable<unknown>) => Awaitable<Socket>
    ) {}
}
