import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report, ReportStatus } from './report.entity';
import { CreateReportDto } from './dto/create-report.dto';
import { AiService } from '../ai/ai.service';
import { RoutingService } from '../routing/routing.service';
import { NotificationService } from '../notifications/notification.service';

@Injectable()
export class ReportsService {
    private readonly logger = new Logger(ReportsService.name);

    constructor(
        @InjectRepository(Report)
        private reportsRepository: Repository<Report>,
        private aiService: AiService,
        private routingService: RoutingService,
        private notificationService: NotificationService,
    ) { }

    async create(createReportDto: CreateReportDto): Promise<Report> {
        try {
            // 1. AI Validation
            this.logger.log(`Validating image via AI...`);
            const aiAnalysis = await this.aiService.analyzeImage(createReportDto.image_url);
            if (!aiAnalysis.valid) {
                this.logger.warn(`Report rejected by AI: ${aiAnalysis.category}`);
            } else {
                this.logger.log(`AI Confidence: ${aiAnalysis.confidence}`);
            }

            // 2. Save Report
            const report = this.reportsRepository.create({
                ...createReportDto,
                user_id: createReportDto.userId, // Map camelCase DTO to snake_case Entity
                status: ReportStatus.OPEN,
            });
            const savedReport = await this.reportsRepository.save(report);

            // 3. Automated Routing
            await this.routingService.routeReport(savedReport.report_id);

            // 4. Send Confirmation Notification
            await this.notificationService.sendStatusUpdate(savedReport.user_id, savedReport.report_id, 'OPEN');

            return savedReport;
        } catch (error) {
            this.logger.error(`Failed to create report: ${error.message}`, error.stack);
            throw error;
        }
    }

    findAll(): Promise<Report[]> {
        return this.reportsRepository.find({ order: { created_at: 'DESC' } });
    }

    findOne(id: string): Promise<Report> {
        return this.reportsRepository.findOneBy({ report_id: id });
    }

    async updateStatus(id: string, status: ReportStatus): Promise<Report> {
        const report = await this.findOne(id);
        if (!report) throw new NotFoundException('Report not found');

        report.status = status;
        const updated = await this.reportsRepository.save(report);

        // Notify User
        await this.notificationService.sendStatusUpdate(report.user_id, report.report_id, status);

        return updated;
    }

    async remove(id: string): Promise<void> {
        const report = await this.findOne(id);
        if (!report) throw new NotFoundException('Report not found');
        await this.reportsRepository.remove(report);
    }

    async assignDepartment(id: string, department: string): Promise<Report> {
        const report = await this.findOne(id);
        if (!report) throw new NotFoundException('Report not found');

        report.assigned_department = department;
        return this.reportsRepository.save(report);
    }
}
