import { Controller, Post, Body, UseGuards, Request, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Roles } from './roles.decorator';
import { RolesGuard } from './roles.guard';
import { UserRole } from '../users/user.entity';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    async login(@Body() body: any) {
        if (body.phone) {
            return this.authService.loginWithPhone(body.phone);
        } else if (body.email && body.password) {
            const user = await this.authService.validateUser(body.email, body.password);
            if (!user) {
                return { error: 'Invalid credentials' };
            }
            return this.authService.login(user);
        }
        return { error: 'Invalid Request' };
    }

    @Post('register')
    async register(@Body() body: any) {
        return this.authService.register(body);
    }

    @Post('change-password')
    async changePassword(@Body() body: any) {
        return this.authService.changePassword(body.userId, body.oldPassword, body.newPassword);
    }
}
