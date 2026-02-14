import { Module } from '@nestjs/common';
import { AiModule } from '../ai/ai.module';
import { RoutingModule } from '../routing/routing.module';
import { NotificationModule } from '../notifications/notification.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { Report } from './report.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Report]),
        AiModule,
        RoutingModule,
        NotificationModule
    ],
    controllers: [ReportsController],
    providers: [ReportsService],
    exports: [ReportsService],
})
export class ReportsModule { }
