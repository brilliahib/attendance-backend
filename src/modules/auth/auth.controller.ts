import {
  Controller,
  Post,
  Body,
  Get,
  Req,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { AuthEntity } from './entities/auth.entity';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AuthenticatedRequest } from '../../common/interfaces/request.interface';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  @ApiCreatedResponse({
    description: 'User registered successfully',
    type: AuthEntity,
  })
  async register(@Body() dto: RegisterDto) {
    const data = await this.authService.create(dto);

    return {
      data: data,
      message: 'User registered successfully',
    };
  }

  @Post('/login')
  @ApiOkResponse({
    description: 'User logged in successfully',
  })
  async login(@Body() dto: LoginDto) {
    const data = await this.authService.login(dto);

    return {
      data: data,
      message: 'User logged in successfully',
    };
  }

  @Get('/get-auth')
  @ApiOkResponse({
    description: 'Get auth endpoint',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getAuth(@Req() req: AuthenticatedRequest) {
    const userId = req.user.id;

    const data = await this.authService.getAuth(userId);

    return {
      data: data,
      message: 'Auth data retrieved successfully',
    };
  }

  @Patch('/profile')
  @ApiOkResponse({
    description: 'Profile updated successfully',
    type: AuthEntity,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @Req() req: AuthenticatedRequest,
    @Body() dto: UpdateProfileDto,
  ) {
    const userId = req.user.id;

    const data = await this.authService.updateProfile(userId, dto);

    return {
      data,
      message: 'Profile updated successfully',
    };
  }

  @Post('change-password')
  @ApiOkResponse({
    description: 'Change user password successfully',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user.id;

    const data = await this.authService.changePassword(
      userId,
      changePasswordDto,
    );
    return {
      data,
      message: 'User password changed successfully',
    };
  }

  // TODO: implement other methods auth (forgot password, reset password, etc.)
}
