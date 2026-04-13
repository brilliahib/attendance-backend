import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../infra/database/prisma/prisma.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { EmployeeEntity } from './entities/employee.entity';

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

  async findAll(): Promise<EmployeeEntity[]> {
    const employees = await this.prisma.employee.findMany({
      where: {
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
      orderBy: {
        createdAt: 'desc',
      },
    });

    return employees.map((employee) => new EmployeeEntity(employee));
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
