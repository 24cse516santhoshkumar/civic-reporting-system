import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsController } from './analytics.controller';
import { Report } from '../reports/report.entity';

import { User } from '../users/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Report, User])],
    controllers: [AnalyticsController],
})
export class AnalyticsModule { }
