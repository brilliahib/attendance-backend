import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';

export class CheckInDto {
  @ApiPropertyOptional({ example: '2026-04-13' })
  @IsOptional()
  @IsDateString()
  workDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  checkInNote?: string;
}
