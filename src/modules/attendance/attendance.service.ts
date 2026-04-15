import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../infra/database/prisma/prisma.service';
import { Prisma } from '../../../generated/prisma/client';
import { GetAllAttendanceDto } from './dto/get-all-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { AttendanceEntity } from './entities/attendance.entity';
import {
  buildPaginationMeta,
  normalizePagination,
  PaginatedResult,
} from '../../common/pagination/pagination';
import { CheckInDto } from './dto/check-in.dto';
import { CheckOutDto } from './dto/check-out.dto';
import { toJakartaUtcDateRange } from '../../utils/date-range';

@Injectable()
export class AttendanceService {
  constructor(private readonly prisma: PrismaService) {}

  private buildWhere(
    filter: GetAllAttendanceDto,
    userId?: string,
  ): Prisma.AttendanceWhereInput {
    const search = filter.search?.trim();

    const workDateRange = toJakartaUtcDateRange(
      filter.workDateFrom,
      filter.workDateTo,
    );

    return {
      ...(userId && {
        employee: {
          is: {
            userId,
            deletedAt: null,
          },
        },
      }),

      ...(filter.employeeId && {
        employeeId: filter.employeeId,
      }),

      ...(search && {
        OR: [
          {
            employee: {
              is: {
                fullName: {
                  contains: search,
                },
              },
            },
          },
          {
            employee: {
              is: {
                employeeCode: {
                  contains: search,
                },
              },
            },
          },
          {
            employee: {
              is: {
                department: {
                  contains: search,
                },
              },
            },
          },
          {
            employee: {
              is: {
                position: {
                  contains: search,
                },
              },
            },
          },
        ],
      }),

      ...(workDateRange && {
        workDate: workDateRange,
      }),
    };
  }

  async checkIn(
    userId: string,
    dto: CheckInDto,
    file: Express.Multer.File,
  ): Promise<AttendanceEntity> {
    if (!file) {
      throw new BadRequestException('Photo check-in is required');
    }

    const employee = await this.prisma.employee.findFirst({
      where: { userId, deletedAt: null },
    });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    const workDate = dto.workDate ? new Date(dto.workDate) : new Date();
    workDate.setHours(0, 0, 0, 0);

    const existing = await this.prisma.attendance.findFirst({
      where: {
        employeeId: employee.id,
        workDate,
      },
    });

    if (existing) {
      throw new ConflictException('Already checked in today');
    }

    const attendance = await this.prisma.attendance.create({
      data: {
        employeeId: employee.id,
        workDate,
        checkInAt: new Date(),
        photoCheckInUrl: `/uploads/attendance/${file.filename}`,
        checkInNote: dto.checkInNote,
      },
      include: {
        employee: true,
      },
    });

    return new AttendanceEntity(attendance);
  }

  async checkOut(
    userId: string,
    dto: CheckOutDto,
    file: Express.Multer.File,
  ): Promise<AttendanceEntity> {
    if (!file) {
      throw new BadRequestException('Photo check-out is required');
    }

    const employee = await this.prisma.employee.findFirst({
      where: { userId, deletedAt: null },
    });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await this.prisma.attendance.findFirst({
      where: {
        employeeId: employee.id,
        workDate: today,
      },
    });

    if (!attendance) {
      throw new NotFoundException('You have not checked in today');
    }

    if (attendance.checkOutAt) {
      throw new ConflictException('Already checked out');
    }

    const updated = await this.prisma.attendance.update({
      where: { id: attendance.id },
      data: {
        checkOutAt: new Date(),
        photoCheckOutUrl: `/uploads/attendance/${file.filename}`,
        checkOutNote: dto.checkOutNote,
      },
      include: {
        employee: true,
      },
    });

    return new AttendanceEntity(updated);
  }

  async findAll(
    filter: GetAllAttendanceDto,
  ): Promise<PaginatedResult<AttendanceEntity>> {
    const where = this.buildWhere(filter);

    const { page, limit, skip } = normalizePagination(
      { page: filter.page, limit: filter.limit },
      { defaultLimit: 10, maxLimit: 100 },
    );

    const [totalItems, rows] = await this.prisma.$transaction([
      this.prisma.attendance.count({ where }),
      this.prisma.attendance.findMany({
        where,
        skip,
        take: limit,
        include: {
          employee: {
            select: {
              id: true,
              employeeCode: true,
              fullName: true,
              department: true,
              position: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
    ]);

    const data = rows.map((row) => new AttendanceEntity(row));
    const pagination = buildPaginationMeta({ page, limit, totalItems });

    return { data, pagination };
  }

  async findByUserId(
    userId: string,
    filter: GetAllAttendanceDto,
  ): Promise<PaginatedResult<AttendanceEntity>> {
    const where = this.buildWhere(filter, userId);

    const { page, limit, skip } = normalizePagination(
      { page: filter.page, limit: filter.limit },
      { defaultLimit: 10, maxLimit: 100 },
    );

    const [totalItems, rows] = await this.prisma.$transaction([
      this.prisma.attendance.count({ where }),
      this.prisma.attendance.findMany({
        where,
        skip,
        select: {
          id: true,
          employeeId: true,
          workDate: true,
          checkInAt: true,
          photoCheckInUrl: true,
          checkInNote: true,
          checkOutAt: true,
          photoCheckOutUrl: true,
          checkOutNote: true,
        },
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
    ]);

    const data = rows.map((row) => new AttendanceEntity(row));
    const pagination = buildPaginationMeta({ page, limit, totalItems });

    return { data, pagination };
  }

  async findAttendanceTodayByUserId(userId: string) {
    const employee = await this.prisma.employee.findFirst({
      where: {
        userId,
        deletedAt: null,
      },
      select: {
        id: true,
      },
    });

    if (!employee) {
      return null;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await this.prisma.attendance.findFirst({
      where: {
        employeeId: employee.id,
        workDate: today,
      },
      select: {
        workDate: true,
        checkInAt: true,
        photoCheckInUrl: true,
        checkInNote: true,
        checkOutAt: true,
        photoCheckOutUrl: true,
        checkOutNote: true,
      },
    });

    return attendance;
  }

  async findById(id: string): Promise<AttendanceEntity> {
    const attendance = await this.prisma.attendance.findFirst({
      where: { id },
      include: {
        employee: {
          select: {
            id: true,
            employeeCode: true,
            fullName: true,
            department: true,
            position: true,
          },
        },
      },
    });

    if (!attendance) {
      throw new NotFoundException('Attendance not found');
    }

    return new AttendanceEntity(attendance);
  }

  async update(
    id: string,
    dto: UpdateAttendanceDto,
  ): Promise<AttendanceEntity> {
    const attendance = await this.prisma.attendance.findFirst({
      where: { id },
    });

    if (!attendance) {
      throw new NotFoundException('Attendance not found');
    }

    if (dto.workDate) {
      const newWorkDate = new Date(dto.workDate);

      const duplicate = await this.prisma.attendance.findFirst({
        where: {
          employeeId: attendance.employeeId,
          workDate: newWorkDate,
          NOT: {
            id,
          },
        },
      });

      if (duplicate) {
        throw new ConflictException(
          'Attendance already exists for this employee on that date',
        );
      }
    }

    const updatedAttendance = await this.prisma.attendance.update({
      where: { id },
      data: {
        ...(dto.workDate && { workDate: new Date(dto.workDate) }),
        ...(dto.checkInAt && { checkInAt: new Date(dto.checkInAt) }),
        ...(dto.photoCheckInUrl && { photoCheckInUrl: dto.photoCheckInUrl }),
        ...(dto.checkInNote !== undefined && { checkInNote: dto.checkInNote }),
        ...(dto.checkOutAt && { checkOutAt: new Date(dto.checkOutAt) }),
        ...(dto.photoCheckOutUrl && {
          photoCheckOutUrl: dto.photoCheckOutUrl,
        }),
        ...(dto.checkOutNote !== undefined && {
          checkOutNote: dto.checkOutNote,
        }),
      },
      include: {
        employee: {
          select: {
            id: true,
            employeeCode: true,
            fullName: true,
            department: true,
            position: true,
          },
        },
      },
    });

    return new AttendanceEntity(updatedAttendance);
  }

  async remove(id: string): Promise<AttendanceEntity> {
    const attendance = await this.prisma.attendance.findFirst({
      where: { id },
    });

    if (!attendance) {
      throw new NotFoundException('Attendance not found');
    }

    const deletedAttendance = await this.prisma.attendance.delete({
      where: { id },
      include: {
        employee: {
          select: {
            id: true,
            employeeCode: true,
            fullName: true,
            department: true,
            position: true,
          },
        },
      },
    });

    return new AttendanceEntity(deletedAttendance);
  }
}
