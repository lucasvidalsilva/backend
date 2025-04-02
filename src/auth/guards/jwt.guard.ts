import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from 'express';

@Injectable()
export class JwtGuard implements CanActivate {
    constructor(private jwtService: JwtService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request & { user?: any }>();
        const token = this.extractTokenFromHeader(request);
        if (!token) throw new UnauthorizedException('Token não fornecido');

        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: process.env.jwtSecretKey,
            });
            request.user = payload;
        } catch (error) {
            throw new UnauthorizedException('Token inválido ou expirado');
        }

        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const authHeader = request.headers.authorization ?? "";
        const [type, token] = authHeader.split(" ");

        return type === 'Bearer' ? token : undefined;
    }
}