import { inject, injectable } from "inversify";
import http from 'http'
import socketIo from "socket.io";
import { TYPES } from "../infrastructure";
import { IRoomsUseCase } from "../use-cases/channels.use-case";

export interface ISocketPortInterface {
    start(server: http.Server): socketIo.Server
}

@injectable()
export class SocketPortInterface implements ISocketPortInterface {
    @inject(TYPES.IRoomsUseCase) private roomUseCase: IRoomsUseCase;
    socketIoServer?: socketIo.Server

    start(server: http.Server): socketIo.Server {
        this.socketIoServer = new socketIo.Server(server, {
            cors: {
                origin: 'http://localhost:3000',
                methods: [ 'GET', 'POST' ]
            }
        })

        this.socketIoServer.on('connection', async (socket) => {
            socket.on("disconnect", async () => console.log("User disconnected"))

            socket.on("chat", async (content) => {
                console.log(content)
            })

            socket.on('joinRoom', async ({ roomId }) => {
                const canJoin = await this.roomUseCase.canJoin(roomId)

                if (canJoin) {
                    socket.join(roomId)
                } 

                socket.emit('joined', { joined: canJoin })
            })
        })

        return this.socketIoServer
    }
    
}
