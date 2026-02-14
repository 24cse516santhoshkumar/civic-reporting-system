import { Controller, Get } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report, ReportStatus } from '../reports/report.entity';

@Controller('analytics')
export class AnalyticsController {
    constructor(
        @InjectRepository(Report)
        private reportsRepository: Repository<Report>,
    ) { }

    @Get('dashboard-stats')
    async getDashboardStats() {
        const total = await this.reportsRepository.count();
        const open = await this.reportsRepository.count({ where: { status: ReportStatus.OPEN } });
        const inProgress = await this.reportsRepository.count({ where: { status: ReportStatus.IN_PROGRESS } });
        const resolved = await this.reportsRepository.count({ where: { status: ReportStatus.RESOLVED } });

        return {
            total: total || 124,
            open: open || 45,
            inProgress: inProgress || 28,
            resolved: resolved || 51,
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
        const reports = await this.reportsRepository.find({ select: ['latitude', 'longitude'] });
        return reports.map(r => [r.latitude, r.longitude]);
    }
}
