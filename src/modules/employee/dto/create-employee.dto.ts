import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateEmployeeDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'User ID should not be empty' })
  @IsString({ message: 'User ID must be a string' })
  userId: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Employee code should not be empty' })
  @MinLength(3, { message: 'Employee code must be at least 3 characters long' })
  employeeCode: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Full name should not be empty' })
  @MinLength(3, { message: 'Full name must be at least 3 characters long' })
  fullName: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: 'Phone must be a string' })
  phone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: 'Department must be a string' })
  department?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: 'Position must be a string' })
  position?: string;

  @ApiPropertyOptional({ example: '2026-04-13' })
  @IsOptional()
  @IsDateString({}, { message: 'Join date must be a valid date string' })
  joinDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: 'Address must be a string' })
  address?: string;
}
