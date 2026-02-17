import { Controller, Get, Post, Body, Param, Patch, Query, Delete, UseGuards, Req } from '@nestjs/common';
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
    @UseGuards(JwtAuthGuard)
    findAll(@Req() req: any) {
        return this.reportsService.findAll(req.user);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.reportsService.findOne(id);
    }

    @Get('user/:userId')
    async findByUser(@Param('userId') userId: string) {
        return this.reportsService.findByUser(userId);
    }

    @Patch(':id/status')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.OFFICIAL)
    updateStatus(@Param('id') id: string, @Body('status') status: ReportStatus) {
        return this.reportsService.updateStatus(id, status);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    remove(@Param('id') id: string, @Req() req: any) {
        return this.reportsService.remove(id, req.user);
    }

    @Patch(':id/assign-department')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    assignDepartment(@Param('id') id: string, @Body('department') department: string) {
        return this.reportsService.assignDepartment(id, department);
    }
}
