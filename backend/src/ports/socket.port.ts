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
    @inject(TYPES.IRoomsUseCase) private channelsService: IRoomsUseCase;
    socketIoServer?: socketIo.Server

    start(server: http.Server): socketIo.Server {
        this.socketIoServer = new socketIo.Server(server)

        this.socketIoServer.on('connection', async (socket) => {
            console.log("New user on room")
            //const user = await this.channelsService.save(socket)

            //user.socket.on('join', ({ channelId }: { channelId: string }) => {
                //this.channelsService.join(channelId, user)
            //})

            socket.on("disconnect", async () => console.log("User disconnected"))

            socket.on("chat", async (content) => {
                console.log(content)
            })
        })

        return this.socketIoServer
    }
    
}
