import { Controller, Get, Post, Body, Param, Patch, Query, Delete, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/user.entity';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { ReportStatus } from './report.entity';

@Controller('reports')
export class ReportsController {
    constructor(private readonly reportsService: ReportsService) { }

    @Post()
    create(@Body() createReportDto: CreateReportDto) {
        return this.reportsService.create(createReportDto);
    }

    @Get()
    findAll(@Query('lat') lat?: number, @Query('lng') lng?: number) {
        if (lat && lng) {
            // nearby logic to be added
            return this.reportsService.findAll();
        }
        return this.reportsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.reportsService.findOne(id);
    }

    @Patch(':id/status')
    updateStatus(@Param('id') id: string, @Body('status') status: ReportStatus) {
        return this.reportsService.updateStatus(id, status);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    remove(@Param('id') id: string) {
        return this.reportsService.remove(id);
    }

    @Patch(':id/assign-department')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    assignDepartment(@Param('id') id: string, @Body('department') department: string) {
        return this.reportsService.assignDepartment(id, department);
    }
}
