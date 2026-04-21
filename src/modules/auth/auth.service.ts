import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthEntity } from './entities/auth.entity';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { PrismaService } from '../../infra/database/prisma/prisma.service';
import { JwtPayload } from '../../infra/auth/jwt-interface';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

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
      joinDate,
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
          joinDate: joinDate ? new Date(joinDate) : undefined,
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

    if (user.deletedAt) {
      throw new UnauthorizedException('Account has been deactivated');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is inactive');
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

  async updateProfile(
    userId: string,
    dto: UpdateProfileDto,
  ): Promise<AuthEntity> {
    const currentUser = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { employee: true },
    });

    if (!currentUser) {
      throw new UnauthorizedException('User not found');
    }

    if (dto.email && dto.email !== currentUser.email) {
      const existingEmail = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });

      if (existingEmail) {
        throw new ConflictException('Email already in use');
      }
    }

    const updatedUser = await this.prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: userId },
        data: {
          ...(dto.email ? { email: dto.email } : {}),
        },
      });

      if (currentUser.employee) {
        await tx.employee.update({
          where: { userId },
          data: {
            ...(dto.fullName ? { fullName: dto.fullName } : {}),
            ...(dto.phone !== undefined ? { phone: dto.phone } : {}),
            ...(dto.address !== undefined ? { address: dto.address } : {}),
          },
        });
      }

      return tx.user.findUniqueOrThrow({
        where: { id: userId },
        include: { employee: true },
      });
    });

    return new AuthEntity(updatedUser);
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const { oldPassword, newPassword, confirmNewPassword } = dto;

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);

    if (!isOldPasswordValid) {
      throw new ConflictException('Current password is incorrect');
    }

    if (newPassword !== confirmNewPassword) {
      throw new ConflictException('New password and confirmation do not match');
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    const result = await this.prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedNewPassword,
      },
    });

    return new AuthEntity(result);
  }

  // TODO: implement other methods auth (forgot password, reset password, etc.)
}
