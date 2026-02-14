import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';

export enum ReportStatus {
    OPEN = 'OPEN',
    IN_PROGRESS = 'IN_PROGRESS',
    APPROVED = 'APPROVED',
    RESOLVED = 'RESOLVED',
    REJECTED = 'REJECTED',
}

@Entity('reports')
export class Report {
    @PrimaryGeneratedColumn('uuid')
    report_id: string;

    @Column()
    user_id: string;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column()
    category: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ nullable: true })
    location: string;

    @Column({ type: 'text' })
    image_url: string;

    @Column('decimal', { precision: 9, scale: 6 })
    latitude: number;

    @Column('decimal', { precision: 9, scale: 6 })
    longitude: number;

    @Column({ type: 'int', nullable: true })
    ward_id: number;

    @Column({
        type: 'simple-enum',
        enum: ReportStatus,
        default: ReportStatus.OPEN,
    })
    status: ReportStatus;

    @Column({ nullable: true })
    assigned_department: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
