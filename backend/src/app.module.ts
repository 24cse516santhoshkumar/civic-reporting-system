import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ReportsModule } from './reports/reports.module';
import { AuthModule } from './auth/auth.module';
import { RoutingModule } from './routing/routing.module';
import { NotificationModule } from './notifications/notification.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { AiModule } from './ai/ai.module';
import { UsersModule } from './users/users.module';
import { User } from './users/user.entity';
import { Report } from './reports/report.entity';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRootAsync({
            useFactory: () => {
                const isProduction = !!process.env.DATABASE_URL;
                return {
                    type: isProduction ? 'postgres' : 'sqlite',
                    url: process.env.DATABASE_URL,
                    database: isProduction ? undefined : 'civic.sqlite',
                    entities: [User, Report],
                    synchronize: true,
                    ssl: isProduction ? { rejectUnauthorized: false } : false,
                } as any;
            },
        }),
        ReportsModule,
        AuthModule,
        RoutingModule,
        NotificationModule,
        AnalyticsModule,
        AiModule,
        UsersModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule { }
