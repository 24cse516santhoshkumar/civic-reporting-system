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
        TypeOrmModule.forRoot({
            type: 'sqlite',
            database: 'civic.sqlite',
            entities: [User, Report],
            synchronize: true, // Auto-create tables for dev
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
