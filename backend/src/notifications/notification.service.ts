import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class NotificationService {
    private readonly logger = new Logger(NotificationService.name);

    async sendStatusUpdate(userId: string, reportId: string, newStatus: string) {
        // In a real app, fetch user's FCM token or phone number
        this.logger.log(`[NOTIFICATION SENT] To User ${userId}: Your report ${reportId} is now ${newStatus}.`);

        // Integration points:
        // await this.fcm.send(...)
        // await this.twilio.sendSms(...)
    }

    async notifyOfficial(deptId: string, reportId: string) {
        this.logger.log(`[ALERT] New Report ${reportId} assigned to Department ${deptId}.`);
    }
}
