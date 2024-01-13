import { Container } from "inversify";
import { TYPES } from "./infrastructure";
import { ExpressRestPort, ExpressRestPortInterface } from "./ports/rest.port";
import { UserMemoryRepository, UserRepository } from "./repositories/user.repository";
import { CardsUseCase, ICardsUseCase } from "./use-cases/cards.use-case";
import { UuidRandomService, IUuid } from "./services/uuid.services";
import { RoomsUseCase, IRoomsUseCase } from "./use-cases/channels.use-case";
import { IRoomRepository, RoomRepository } from "./repositories/room.repository";
import { ISocketPortInterface, SocketPortInterface } from "./ports/socket.port";

const container = new Container();
container.bind<ISocketPortInterface>(TYPES.ISocketPortInterface).to(SocketPortInterface).inSingletonScope();
container.bind<UserRepository>(TYPES.UserRepository).to(UserMemoryRepository).inSingletonScope()
container.bind<ICardsUseCase>(TYPES.ICardsUseCase).to(CardsUseCase);
container.bind<ExpressRestPortInterface>(TYPES.ExpressRestPort).to(ExpressRestPort);
container.bind<IUuid>(TYPES.UuidService).to(UuidRandomService);
container.bind<IRoomsUseCase>(TYPES.IRoomsUseCase).to(RoomsUseCase);
container.bind<IRoomRepository>(TYPES.IRoomRepository).to(RoomRepository);


export { container };
