import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthEntity } from './entities/auth.entity';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { PrismaService } from '../../infra/database/prisma/prisma.service';
import { JwtPayload } from '../../infra/auth/jwt-interface';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}
  async create(dto: RegisterDto): Promise<AuthEntity> {
    const {
      confirm_password,
      employeeCode,
      fullName,
      phone,
      department,
      position,
      address,
      ...data
    } = dto;

    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const existingEmployeeCode = await this.prisma.employee.findUnique({
      where: { employeeCode },
    });

    if (existingEmployeeCode) {
      throw new ConflictException('Employee code already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const result = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: data.email,
          password: hashedPassword,
        },
      });

      await tx.employee.create({
        data: {
          userId: user.id,
          employeeCode,
          fullName,
          phone,
          department,
          position,
          address,
        },
      });

      return tx.user.findUniqueOrThrow({
        where: { id: user.id },
        include: {
          employee: true,
        },
      });
    });

    return new AuthEntity(result);
  }

  async login(dto: LoginDto): Promise<{ token: string }> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload: JwtPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      token: this.jwtService.sign(payload, {
        expiresIn: '30d',
      }),
    };
  }

  async getAuth(userId: string): Promise<AuthEntity> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        employee: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const { password, ...safeUser } = user;

    return new AuthEntity(safeUser);
  }

  // TODO: implement other methods auth (forgot password, reset password, etc.)
}
