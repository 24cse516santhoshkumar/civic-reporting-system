import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from '../reports/report.entity';

@Injectable()
export class RoutingService {
    constructor(
        @InjectRepository(Report)
        private reportsRepository: Repository<Report>,
    ) { }

    // Mapping Configuration
    private readonly CATEGORY_DEPT_MAP = {
        'Pothole': 'Roads & Bridges',
        'Garbage': 'Sanitation',
        'Street Light': 'Electrical',
        'Water Leak': 'Water Supply',
    };

    async routeReport(reportId: string) {
        const report = await this.reportsRepository.findOneBy({ report_id: reportId });
        if (!report) return;

        const deptName = this.CATEGORY_DEPT_MAP[report.category] || 'General Administration';

        // In a real app, we would look up the Department ID from the DB
        // and create an Assignment entity.
        // For MVP, we'll just log the assignment logic.

        console.log(`[ROUTING ENGINE] Report ${reportId} (${report.category}) assigned to: ${deptName}`);

        // Simulate updating a "department_assigned" field if we had one on the entity directly
        // report.assigned_dept = deptName;
        // await this.reportsRepository.save(report);
    }
}
