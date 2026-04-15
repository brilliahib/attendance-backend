import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class DashboardSummaryEntity {
  @ApiProperty({
    example: 25,
    description: 'Jumlah karyawan aktif',
  })
  totalEmployees: number;

  @ApiPropertyOptional({
    example: '08:12',
    description: 'Rata-rata jam check-in dalam format HH:mm',
  })
  averageCheckinTime: string | null;

  @ApiPropertyOptional({
    example: '17:05',
    description: 'Rata-rata jam check-out dalam format HH:mm',
  })
  averageCheckoutTime: string | null;

  constructor(partial: Partial<DashboardSummaryEntity>) {
    Object.assign(this, partial);
  }
}
