import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '../../../../generated/prisma/enums';
import { EmployeeEntity } from '../../employee/entities/employee.entity';

export class AuthEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty({ enum: Role })
  role: Role;

  @ApiProperty()
  isActive: boolean;

  @ApiPropertyOptional({ type: EmployeeEntity })
  employee?: EmployeeEntity | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  constructor(partial: Partial<AuthEntity>) {
    Object.assign(this, partial);
  }
}
