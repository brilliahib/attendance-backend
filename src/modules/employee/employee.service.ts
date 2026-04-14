import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../infra/database/prisma/prisma.service';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { EmployeeEntity } from './entities/employee.entity';
import { GetAllEmployeeDto } from './dto/get-all-employee.dto';
import {
  buildPaginationMeta,
  normalizePagination,
  PaginatedResult,
} from '../../common/pagination/pagination';
import { Prisma } from '../../../generated/prisma/client';

@Injectable()
export class EmployeeService {
  constructor(private readonly prisma: PrismaService) {}

  async checkProfileEmployee(userId: string): Promise<boolean> {
    const employee = await this.prisma.employee.findUnique({
      where: { userId },
      select: { id: true },
    });

    return !!employee;
  }

  async findAll(
    filter: GetAllEmployeeDto,
  ): Promise<PaginatedResult<EmployeeEntity>> {
    const { search, department } = filter;

    const where: Prisma.EmployeeWhereInput = {
      user: {
        role: 'EMPLOYEE',
      },
      deletedAt: null,

      ...(search?.trim() && {
        OR: [
          {
            fullName: {
              contains: search.trim(),
            },
          },
          {
            employeeCode: {
              contains: search.trim(),
            },
          },
          {
            position: {
              contains: search.trim(),
            },
          },
          {
            user: {
              email: {
                contains: search.trim(),
              },
            },
          },
        ],
      }),

      ...(department && {
        department: {
          equals: department,
        },
      }),
    };

    const { page, limit, skip, take } = normalizePagination(
      { page: filter.page, limit: filter.limit },
      { defaultLimit: 10, maxLimit: 100 },
    );

    const [totalItems, rows] = await this.prisma.$transaction([
      this.prisma.employee.count({ where }),
      this.prisma.employee.findMany({
        where,
        skip,
        take,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              role: true,
              isActive: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
    ]);

    const data = rows.map((employee) => new EmployeeEntity(employee));
    const pagination = buildPaginationMeta({ page, limit, totalItems });

    return { data, pagination };
  }

  async findOne(id: string): Promise<EmployeeEntity> {
    const employee = await this.prisma.employee.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            isActive: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    return new EmployeeEntity(employee);
  }

  async findByUserId(userId: string): Promise<EmployeeEntity | null> {
    const employee = await this.prisma.employee.findFirst({
      where: {
        userId,
        deletedAt: null,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            isActive: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    return employee ? new EmployeeEntity(employee) : null;
  }

  async update(id: string, dto: UpdateEmployeeDto): Promise<EmployeeEntity> {
    const employee = await this.prisma.employee.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        user: true,
      },
    });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    if (dto.employeeCode) {
      const codeExists = await this.prisma.employee.findFirst({
        where: {
          employeeCode: dto.employeeCode,
          NOT: { id },
        },
      });

      if (codeExists) {
        throw new ConflictException('Employee code already used');
      }
    }

    if (dto.email) {
      const emailExists = await this.prisma.user.findFirst({
        where: {
          email: dto.email,
          NOT: { id: employee.userId },
        },
      });

      if (emailExists) {
        throw new ConflictException('Email already used');
      }
    }

    const userData =
      dto.email !== undefined || dto.isActive !== undefined
        ? {
            update: {
              email: dto.email,
              isActive: dto.isActive,
            },
          }
        : undefined;

    const updatedEmployee = await this.prisma.employee.update({
      where: { id },
      data: {
        employeeCode: dto.employeeCode,
        fullName: dto.fullName,
        phone: dto.phone,
        department: dto.department,
        position: dto.position,
        joinDate: dto.joinDate ? new Date(dto.joinDate) : undefined,
        address: dto.address,
        user: userData,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            isActive: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    return new EmployeeEntity(updatedEmployee);
  }

  async remove(id: string): Promise<EmployeeEntity> {
    const employee = await this.prisma.employee.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    const result = await this.prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: employee.userId },
        data: {
          isActive: false,
          deletedAt: new Date(),
        },
      });

      return tx.employee.update({
        where: { id },
        data: {
          deletedAt: new Date(),
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              role: true,
              isActive: true,

              createdAt: true,
              updatedAt: true,
            },
          },
        },
      });
    });

    return new EmployeeEntity(result);
  }
}
