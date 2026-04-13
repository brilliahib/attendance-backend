import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '../../../../generated/prisma/client';

export class EmployeeUserEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty({ enum: Role })
  role: Role;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  constructor(partial: Partial<EmployeeUserEntity>) {
    Object.assign(this, partial);
  }
}

export class EmployeeEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  employeeCode: string;

  @ApiProperty()
  fullName: string;

  @ApiPropertyOptional()
  phone?: string | null;

  @ApiPropertyOptional()
  department?: string | null;

  @ApiPropertyOptional()
  position?: string | null;

  @ApiPropertyOptional()
  joinDate?: Date | null;

  @ApiPropertyOptional()
  address?: string | null;

  @ApiPropertyOptional({ type: EmployeeUserEntity })
  user?: EmployeeUserEntity;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  constructor(partial: Partial<EmployeeEntity>) {
    Object.assign(this, partial);
  }
}
