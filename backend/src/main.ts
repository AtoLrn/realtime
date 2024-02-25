import 'reflect-metadata';
import { TYPES } from './infrastructure';
import { container } from './inversify.config';

import {  ExpressRestPortInterface } from "./ports/rest.port";
import {prisma} from './database';
import { hash } from 'bcryptjs'

const server = container.get<ExpressRestPortInterface>(TYPES.ExpressRestPort);

(async () => {
    const dbUser = await prisma.user.findUnique({
        where: {
            email: "admin@gmail.com"
        }
    })

    const password = await hash("password", 10)

    if(!dbUser) {
        await prisma.user.create({
            data: {
                username: "admin",
                email: "admin@gmail.com",
                password: password,
                isAdmin: true
            }
        })
    }
})()

server.start(8000)
