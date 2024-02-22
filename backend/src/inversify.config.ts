import { Container } from "inversify";
import { TYPES } from "./infrastructure";
import { ExpressRestPort, ExpressRestPortInterface } from "./ports/rest.port";
import { UserRepository, IUserRepository } from "./repositories/user.repository";
import { CardsUseCase, ICardsUseCase } from "./use-cases/cards.use-case";
import { UuidRandomService, IUuid } from "./services/uuid.services";
import { RoomsUseCase, IRoomsUseCase } from "./use-cases/channels.use-case";
import { IRoomRepository, RoomRepository } from "./repositories/room.repository";
import { ISocketPortInterface, SocketPortInterface } from "./ports/socket.port";
import { IPassword, PasswordService } from "./services/password.services";
import { IUsersUseCase, UsersUseCase } from "./use-cases/users.use-case";
import { IJsonWebToken, JsonWebTokenService } from "./services/jwt.services";
import { IQuizRepository, QuizRepository } from "./repositories/quiz.repository";
import { IQuizUseCase, QuizUseCase } from "./use-cases/quiz.use-case";

const container = new Container();
container.bind<ISocketPortInterface>(TYPES.ISocketPortInterface).to(SocketPortInterface).inSingletonScope();
container.bind<IUserRepository>(TYPES.IUserRepository).to(UserRepository).inSingletonScope();
container.bind<IQuizRepository>(TYPES.IQuizRepository).to(QuizRepository).inSingletonScope();
container.bind<ICardsUseCase>(TYPES.ICardsUseCase).to(CardsUseCase);
container.bind<IUsersUseCase>(TYPES.IUsersUseCase).to(UsersUseCase);
container.bind<IQuizUseCase>(TYPES.IQuizUseCase).to(QuizUseCase);
container.bind<ExpressRestPortInterface>(TYPES.ExpressRestPort).to(ExpressRestPort);
container.bind<IUuid>(TYPES.UuidService).to(UuidRandomService);
container.bind<IRoomsUseCase>(TYPES.IRoomsUseCase).to(RoomsUseCase);
container.bind<IRoomRepository>(TYPES.IRoomRepository).to(RoomRepository);
container.bind<IPassword>(TYPES.IPassword).to(PasswordService);
container.bind<IJsonWebToken>(TYPES.IJsonWebToken).to(JsonWebTokenService);


export { container };
