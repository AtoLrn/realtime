import { inject, injectable } from "inversify";
import express from 'express';
import cors from 'cors'
import socketIo from "socket.io";
import http from 'http'
import { TYPES } from '../infrastructure';
import { IRoomsUseCase } from '../use-cases/channels.use-case';
import { ISocketPortInterface } from './socket.port';
import { ICardsUseCase } from "../use-cases/cards.use-case";
import { IUsersUseCase, UsersUseCase } from "../use-cases/users.use-case";

export interface ExpressRestPortInterface {
    start(port: number): void
}

@injectable()
export class ExpressRestPort implements ExpressRestPortInterface {
    @inject(TYPES.ICardsUseCase) private cardsUseCase: ICardsUseCase;
    @inject(TYPES.IUsersUseCase) private usersUseCase: IUsersUseCase;
    @inject(TYPES.ISocketPortInterface) private socketPort: ISocketPortInterface;
    
    private expressApp: express.Express
    private socketIoApp: socketIo.Server
    private server: http.Server
    constructor() {
        this.expressApp = express();
        this.server = http.createServer(this.expressApp)
    }

    public start(port: number) {
        this.socketIoApp = this.socketPort.start(this.server)

        this.expressApp.use(cors());
        this.expressApp.use(express.json());

        this.expressApp.get("/", async (req, res) => {
            res.send('YES')
        });

        this.expressApp.get('/api/rooms', async (req, res) => {
            res.send({
                rooms: await this.cardsUseCase.getRooms()
            })
        })

        this.expressApp.post('/api/register', async (req, res) => {
            try {
                res.send(JSON.stringify(await this.usersUseCase.createUser(req.body as UsersUseCase.Create)))   
            } catch (e) {
                res.status(400).send(e.message)
            }
        })

        this.expressApp.post('/api/login', async (req, res) => {
            try {
                res.send(JSON.stringify(await this.usersUseCase.loginUser(req.body as UsersUseCase.Login)))   
            } catch (e) {
                res.status(400).send(e.message)
            }
        })
       
        this.server.listen(port, () => {
            console.log(`Listening on port: ${port}`)
        })
    }
}
