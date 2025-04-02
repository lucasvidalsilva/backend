import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/auth.dto';
import {compare} from "bcrypt"
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private userService: UserService, 
        private jwtService:JwtService
        ) {}

    async login(dto:LoginDto){
        const user = await this.validateUser(dto);
        const payload ={
            username:user.email,
            sub:{
                name:user.name,
            },
        };

        return {
            user,
            backendTokens:{
                accessToken: await this.jwtService.signAsync(payload,{
                    expiresIn: '1h',
                    secret:process.env.jwtSecretKey,
                }),
                refreshToken: await this.jwtService.signAsync(payload,{
                    expiresIn: '7d',
                    secret:process.env.jwtRefreshTokenKey,
                }),
            },
        };
    }

    async validateUser(dto:LoginDto){

        const user = await this.userService.findByEmail(dto.username);

        if(user && (await compare(dto.password,user.password))){
            const { password, ...result } = user;
            return result;
        }
        throw new UnauthorizedException();
    }
}
