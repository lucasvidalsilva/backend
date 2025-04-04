import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/auth.dto';
import {compare} from "bcrypt"
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    private deathNoteTokens: Set<string> = new Set();
    constructor(private userService: UserService, 
        private jwtService:JwtService
        ) {}

    async login(dto:LoginDto){
        const user = await this.validateUser(dto);
        const payload ={
            sub:user.id,
            email:user.email,
            name:user.name,
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

    async logout(token: string) {
        this.deathNoteTokens.add(token);
        return true;
    }

    isTokenDeathNote(token: string): boolean {
        return this.deathNoteTokens.has(token);
    }
    
}
