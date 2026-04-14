import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AttendanceEmployeeEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  employeeCode: string;

  @ApiProperty()
  fullName: string;

  @ApiPropertyOptional()
  department?: string | null;

  @ApiPropertyOptional()
  position?: string | null;

  constructor(partial: Partial<AttendanceEmployeeEntity>) {
    Object.assign(this, partial);
  }
}

export class AttendanceEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  employeeId: string;

  @ApiProperty()
  workDate: Date;

  @ApiProperty()
  checkInAt: Date;

  @ApiProperty()
  photoCheckInUrl: string;

  @ApiPropertyOptional()
  checkInNote?: string | null;

  @ApiPropertyOptional()
  checkOutAt?: Date | null;

  @ApiPropertyOptional()
  photoCheckOutUrl?: string | null;

  @ApiPropertyOptional()
  checkOutNote?: string | null;

  @ApiPropertyOptional({ type: AttendanceEmployeeEntity })
  employee?: AttendanceEmployeeEntity;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  constructor(partial: Partial<AttendanceEntity>) {
    Object.assign(this, partial);
  }
}
