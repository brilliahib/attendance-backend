import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';

export class UpdateAttendanceDto {
  @ApiPropertyOptional({ example: '2026-04-13' })
  @IsOptional()
  @IsDateString({}, { message: 'workDate must be a valid date string' })
  workDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString({}, { message: 'checkInAt must be a valid date string' })
  checkInAt?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: 'photoCheckInUrl must be a string' })
  photoCheckInUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: 'checkInNote must be a string' })
  checkInNote?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString({}, { message: 'checkOutAt must be a valid date string' })
  checkOutAt?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: 'photoCheckOutUrl must be a string' })
  photoCheckOutUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: 'checkOutNote must be a string' })
  checkOutNote?: string;
}
