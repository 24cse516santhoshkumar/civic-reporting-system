import { IsString, IsNotEmpty, IsNumber, IsOptional, IsUrl } from 'class-validator';

export class CreateReportDto {
    @IsString()
    @IsNotEmpty()
    userId: string; // For MVP, passing userId directly. in prod, extract from JWT.

    @IsString()
    @IsNotEmpty()
    category: string;

    @IsString()
    @IsOptional()
    description: string;

    @IsString()
    @IsNotEmpty()
    location: string;

    @IsString()
    @IsNotEmpty()
    image_url: string;

    @IsNumber()
    @IsNotEmpty()
    latitude: number;

    @IsNumber()
    @IsNotEmpty()
    longitude: number;
}
