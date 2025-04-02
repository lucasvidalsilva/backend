import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from './dto/user.dto';
import { hash } from "bcrypt"

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService){}
    

    async create(dto:CreateUserDto) {
        const user = await this.prisma.user.findUnique({
            where:{
                email:dto.email,
            },
        });

        if (user) throw new ConflictException("email já cadastrado");

        const newUser = await this.prisma.user.create({

            data:{
                ...dto,
                password: await hash(dto.password,11),
            },
        });
        
        const {password,...result} = newUser;
        return result;
    }

    async findByEmail(email:string){
        return await this.prisma.user.findUnique({
            where:{
                email: email,
            },
        });
    } 

    async getUserById(id: number) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: id,
            },
            select: {
                id: true,
                name: true,
            },
        });

        if (!user) throw new NotFoundException('Usuario não encontrado');

        return user;
    }
}
