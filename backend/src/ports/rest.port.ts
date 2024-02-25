import { inject, injectable } from "inversify";
import express from 'express';
import cors from 'cors'
import socketIo from "socket.io";
import http from 'http'
import { TYPES } from '../infrastructure';
import { ISocketPortInterface } from './socket.port';
import { IUsersUseCase, UsersUseCase } from "../use-cases/users.use-case";
import {IQuizUseCase, QuizUseCase} from "../use-cases/quiz.use-case";
import {IQuestionUseCase, QuestionUseCase} from "../use-cases/question.use-case";
import {AnswerUseCase, IAnswerUseCase} from "../use-cases/answer.use-case";
import { IRoomsUseCase } from "../use-cases/channels.use-case";

export interface ExpressRestPortInterface {
    start(port: number): void
}

@injectable()
export class ExpressRestPort implements ExpressRestPortInterface {
    @inject(TYPES.IUsersUseCase) private usersUseCase: IUsersUseCase;
    @inject(TYPES.IQuizUseCase) private quizUseCase: IQuizUseCase;
    @inject(TYPES.IQuestionUseCase) private questionUseCase: IQuestionUseCase;
    @inject(TYPES.IAnswerUseCase) private answerUseCase: IAnswerUseCase;
    @inject(TYPES.ISocketPortInterface) private socketPort: ISocketPortInterface;
    @inject(TYPES.IRoomsUseCase) private roomUseCase: IRoomsUseCase;
    
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
                rooms: await this.roomUseCase.getRooms()
            })
        })

        this.expressApp.post('/api/register', async (req, res) => {
            try {
                res.send(JSON.stringify(await this.usersUseCase.createUser(req.body as UsersUseCase.Create)))   
            } catch (e) {
                res.status(400).send(JSON.stringify(e.message))
            }
        })

        this.expressApp.post('/api/login', async (req, res) => {
            try {
                res.send(JSON.stringify(await this.usersUseCase.loginUser(req.body as UsersUseCase.Login)))   
            } catch (e) {
                res.status(400).send(JSON.stringify(e.message))
            }
        })

        this.expressApp.post('/api/quiz', async (req, res) => {
            try {
                res.send(JSON.stringify(await this.quizUseCase.createQuiz(req.body as QuizUseCase.Create)))   
            } catch (e) {
                res.status(400).send(JSON.stringify(e.message))
            }
        })

        this.expressApp.post('/api/quiz/start', async (req, res) => {
            try {
                res.send(JSON.stringify(await this.quizUseCase.startQuiz(req.body.id as number)))   
            } catch (e) {
                res.status(400).send(JSON.stringify(e.message))
            }
        })

        this.expressApp.post('/api/room/start', async (req, res) => {
            try {
                const room = await this.roomUseCase.start(req.body.roomId as string) 

                this.socketIoApp.to(room.id).emit('start')

                const howManyQuestions = room.quiz.questions.length ?? 0

                if (howManyQuestions === 0) {
                    res.send(JSON.stringify(room))  
                    this.roomUseCase.stop(req.body.roomId as string) 
                    return
                }

                for (const [i, question] of (room.quiz.questions ?? []).entries()) {
                    const hiddenQuestioon = {
                        ...question,
                        answers: question.answers.map((answer) => ({
                            id: answer.id,
                            content: answer.content
                        }))
                    }
                    setTimeout(() => {
                        this.socketIoApp.to(room.id).emit('question', hiddenQuestioon)
                    }, 10_000 * i)
                }

                setTimeout(() => {
                    this.socketIoApp.to(room.id).emit('end', {})
                    this.roomUseCase.stop(req.body.roomId as string) 
                }, 10_000 * howManyQuestions)

                res.send(JSON.stringify(room))   
            } catch (e) {
                res.status(400).send(JSON.stringify(e.message))
            }
        })

        this.expressApp.get('/api/quiz', async (req, res) => {
            try {
                res.send(JSON.stringify(await this.quizUseCase.getAllQuiz()))   
            } catch (e) {
                res.status(400).send(JSON.stringify(e.message))
            }
        })

        this.expressApp.get('/api/quiz/:id', async (req, res) => {
            const id = parseInt(req.params.id);

            try {
                res.send(JSON.stringify(await this.quizUseCase.getQuizById(id)))   
            } catch (e) {
                res.status(400).send(JSON.stringify(e.message))
            }
        })

        this.expressApp.get('/api/room/:id', async (req, res) => {
            const id = req.params.id;

            try {
                res.send(JSON.stringify(await this.roomUseCase.getRoomById(id)))   
            } catch (e) {
                res.status(400).send(JSON.stringify(e.message))
            }
        })

        this.expressApp.post('/api/question', async (req, res) => {
            try {
                res.send(JSON.stringify(await this.questionUseCase.createQuestion(req.body as QuestionUseCase.Create)))   
            } catch (e) {
                res.status(400).send(JSON.stringify(e.message))
            }
        })

        this.expressApp.delete('/api/question/:id', async (req, res) => {
            const id = parseInt(req.params.id)

            try {
                res.send(JSON.stringify(await this.questionUseCase.deleteQuestion(id)))
            } catch (e) {
                res.status(400).send(JSON.stringify(e.message))
            }
        })

        this.expressApp.post('/api/answer', async (req, res) => {
            try {
                res.send(JSON.stringify(await this.answerUseCase.createAnswer(req.body as AnswerUseCase.Create)))   
            } catch (e) {
                res.status(400).send(JSON.stringify(e.message))
            }
        })

        this.expressApp.delete('/api/answer/:id', async (req, res) => {
            const id = parseInt(req.params.id)

            try {
                res.send(JSON.stringify(await this.answerUseCase.deleteAnswer(id)))
            } catch (e) {
                res.status(400).send(JSON.stringify(e.message))
            }
        })
       
        this.server.listen(port, () => {
            console.log(`Listening on port: ${port}`)
        })
    }
}
