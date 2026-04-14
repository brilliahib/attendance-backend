import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class GetAllAttendanceDto {
  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Page must be an integer' })
  @Min(1, { message: 'Page must be at least 1' })
  page?: number = 1;

  @ApiPropertyOptional({ default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Limit must be an integer' })
  @Min(1, { message: 'Limit must be at least 1' })
  @Max(100, { message: 'Limit must not exceed 100' })
  limit?: number = 10;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: 'Search must be a string' })
  search?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: 'Employee ID must be a string' })
  employeeId?: string;

  @ApiPropertyOptional({ example: '2026-04-13' })
  @IsOptional()
  @IsDateString({}, { message: 'workDateFrom must be a valid date string' })
  workDateFrom?: string;

  @ApiPropertyOptional({ example: '2026-04-13' })
  @IsOptional()
  @IsDateString({}, { message: 'workDateTo must be a valid date string' })
  workDateTo?: string;
}
