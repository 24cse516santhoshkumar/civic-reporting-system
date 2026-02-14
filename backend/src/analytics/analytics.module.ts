import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsController } from './analytics.controller';
import { Report } from '../reports/report.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Report])],
    controllers: [AnalyticsController],
})
export class AnalyticsModule { }
