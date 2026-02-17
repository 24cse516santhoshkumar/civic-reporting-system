import { Controller, Get } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report, ReportStatus } from '../reports/report.entity';
import { User } from '../users/user.entity';

@Controller('analytics')
export class AnalyticsController {
    constructor(
        @InjectRepository(Report)
        private reportsRepository: Repository<Report>,
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    @Get('dashboard-stats')
    async getDashboardStats() {
        const total = await this.reportsRepository.count();
        const open = await this.reportsRepository.count({ where: { status: ReportStatus.OPEN } });
        const inProgress = await this.reportsRepository.count({ where: { status: ReportStatus.IN_PROGRESS } });
        const resolved = await this.reportsRepository.count({ where: { status: ReportStatus.RESOLVED } });
        const totalUsers = await this.usersRepository.count();

        return {
            total,
            open,
            inProgress,
            resolved,
            totalUsers,
            avgResolutionTime: '2.4 Days',
            wardPerformance: {
                'Ward 1': 80,
                'Ward 2': 65,
                'Ward 3': 92,
            },
        };
    }

    @Get('heatmap')
    async getHeatmapData() {
        // Return Lat/Lng points of all reports
        const reports = await this.reportsRepository.find({ select: { latitude: true, longitude: true } });
        return reports.map(r => [Number(r.latitude), Number(r.longitude)]);
    }
}
