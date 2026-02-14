import { Injectable, OnModuleInit, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../users/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService implements OnModuleInit {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private jwtService: JwtService,
    ) { }

    async onModuleInit() {
        // Create Default Admin from Docs
        const adminEmail = 'admin@civic.com';
        const existingAdmin = await this.usersRepository.findOneBy({ email: adminEmail });

        if (!existingAdmin) {
            console.log('Creating Default Admin User...');
            const hashedPassword = await bcrypt.hash('admin123', 10);
            const admin = this.usersRepository.create({
                email: adminEmail,
                password: hashedPassword,
                role: UserRole.ADMIN,
                provider: 'LOCAL',
            });
            await this.usersRepository.save(admin);
            console.log(`Default Admin Created: ${adminEmail} / admin123`);
        }
    }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersRepository.findOneBy({ email });
        if (user && await bcrypt.compare(pass, user.password)) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        const payload = { email: user.email, sub: user.user_id, role: user.role };
        return {
            access_token: this.jwtService.sign(payload),
            user
        };
    }

    async register(data: any) {
        const existing = await this.usersRepository.findOneBy({ email: data.email });
        if (existing) {
            throw new ConflictException('Email already exists');
        }

        if (data.phone) {
            const existingPhone = await this.usersRepository.findOneBy({ phone_number: data.phone });
            if (existingPhone) {
                throw new ConflictException('Phone number already in use');
            }
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);
        const user = this.usersRepository.create({
            email: data.email,
            password: hashedPassword,
            phone_number: data.phone,
            role: UserRole.CITIZEN,
            provider: 'LOCAL'
        });
        return this.usersRepository.save(user);
    }

    async createAdmin(data: any) {
        const existing = await this.usersRepository.findOneBy({ email: data.email });
        if (existing) {
            throw new ConflictException('Email already exists');
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);
        const user = this.usersRepository.create({
            email: data.email,
            password: hashedPassword,
            phone_number: data.phone,
            role: UserRole.ADMIN,
            provider: 'LOCAL'
        });
        return this.usersRepository.save(user);
    }

    async changePassword(userId: string, oldPass: string, newPass: string) {
        const user = await this.usersRepository.findOneBy({ user_id: userId });
        if (!user) throw new UnauthorizedException();

        const isMatch = await bcrypt.compare(oldPass, user.password);
        if (!isMatch) throw new UnauthorizedException('Incorrect old password');

        user.password = await bcrypt.hash(newPass, 10);
        return this.usersRepository.save(user);
    }

    async loginWithPhone(phoneNumber: string) {
        let user = await this.usersRepository.findOneBy({ phone_number: phoneNumber });
        if (!user) {
            user = this.usersRepository.create({
                phone_number: phoneNumber,
                role: UserRole.CITIZEN
            });
            await this.usersRepository.save(user);
        }
        const payload = { phone: user.phone_number, sub: user.user_id, role: user.role };
        return {
            access_token: this.jwtService.sign(payload),
            user
        };
    }
}
