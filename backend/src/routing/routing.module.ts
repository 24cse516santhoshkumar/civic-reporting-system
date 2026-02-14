import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoutingService } from './routing.service';
import { Report } from '../reports/report.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Report])],
    providers: [RoutingService],
    exports: [RoutingService],
})
export class RoutingModule { }
