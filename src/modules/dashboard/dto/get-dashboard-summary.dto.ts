import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional } from 'class-validator';

export class GetDashboardSummaryDto {
  @ApiPropertyOptional({
    example: '2026-04-01',
    description: 'Filter data absensi dari tanggal ini',
  })
  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @ApiPropertyOptional({
    example: '2026-04-30',
    description: 'Filter data absensi sampai tanggal ini',
  })
  @IsOptional()
  @IsDateString()
  toDate?: string;
}
