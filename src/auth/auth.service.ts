import { ForbiddenException, Injectable } from "@nestjs/common";
import { AuthDto } from "src/dto";
import { PrismaService } from "src/prisma/prisma.service";

import * as argon from "argon2"
import { using } from "rxjs";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";

@Injectable({})
export class AuthService {
    constructor(private prisma: PrismaService){}
    async signin(dto: AuthDto){
        // find user by email
        const user = await this.prisma.user.findUnique({
            where:{
                email: dto.email
            }
        })

        // if a user with that email does not exist we stop the process
        if(!user) throw new ForbiddenException('Credentials incorrect')

        // compare two password
        const pwMatches = await argon.verify(user.hash, dto.password)
        if(!pwMatches) throw new ForbiddenException('Credentials incorrect')
    }

    async signup(dto: AuthDto){

        try{
            const hash = await argon.hash(dto.password)

            const user = await this.prisma.user.create({
                data:{
                    email: dto.email,
                    hash
                }
            })

            delete user.hash

            return user;
        } catch(error){
            if(error instanceof PrismaClientKnownRequestError){
                if(error.code === "P2002"){
                    throw new ForbiddenException('Credentials taken')
                }
                throw error;
            }
        }
        
    }
}