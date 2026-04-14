import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Match } from '../../../common/decorators/match.decorator';

export class RegisterDto {
  @ApiProperty()
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Password should not be empty' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Confirmation password should not be empty' })
  @Match('password', { message: 'Confirmation password must match password' })
  confirm_password: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Employee code should not be empty' })
  @IsString({ message: 'Employee code must be a string' })
  employeeCode: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Full name should not be empty' })
  @IsString({ message: 'Full name must be a string' })
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

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: 'Address must be a string' })
  address?: string;

  @ApiPropertyOptional({ example: '2026-04-13' })
  @IsOptional()
  @IsDateString({}, { message: 'Join date must be a valid date string' })
  joinDate?: string;
}
