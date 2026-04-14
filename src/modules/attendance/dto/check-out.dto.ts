import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CheckOutDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  checkOutNote?: string;
}
