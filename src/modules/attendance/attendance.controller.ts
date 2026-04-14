import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
} from '@nestjs/swagger';
import { AttendanceService } from './attendance.service';
import { AttendanceEntity } from './entities/attendance.entity';
import { GetAllAttendanceDto } from './dto/get-all-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/role.guard';
import { Roles } from '../../common/decorators/role.decorator';
import { Role } from '../../../generated/prisma/enums';
import { AuthenticatedRequest } from '../../common/interfaces/request.interface';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { randomUUID } from 'crypto';
import { CheckInDto } from './dto/check-in.dto';
import { CheckOutDto } from './dto/check-out.dto';

@Controller('attendances')
@ApiBearerAuth()
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post('check-in')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: './uploads/attendance',
        filename: (req, file, cb) => {
          const ext = extname(file.originalname);
          cb(null, `${randomUUID()}${ext}`);
        },
      }),
    }),
  )
  async checkIn(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CheckInDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const data = await this.attendanceService.checkIn(req.user.id, dto, file);

    return {
      data,
      message: 'Check-in success',
    };
  }

  @Post('check-out')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: './uploads/attendance',
        filename: (req, file, cb) => {
          const ext = extname(file.originalname);
          cb(null, `${randomUUID()}${ext}`);
        },
      }),
    }),
  )
  async checkOut(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CheckOutDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const data = await this.attendanceService.checkOut(req.user.id, dto, file);

    return {
      data,
      message: 'Check-out success',
    };
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOkResponse({
    description: 'Attendances retrieved successfully',
    type: [AttendanceEntity],
  })
  async findAll(@Query() query: GetAllAttendanceDto) {
    const result = await this.attendanceService.findAll(query);

    return {
      data: result.data,
      pagination: result.pagination,
      message: 'Attendances retrieved successfully',
    };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    description: 'My attendances retrieved successfully',
    type: [AttendanceEntity],
  })
  async findByUserId(
    @Req() req: AuthenticatedRequest,
    @Query() query: GetAllAttendanceDto,
  ) {
    const userId = req.user.id;
    const result = await this.attendanceService.findByUserId(userId, query);

    return {
      data: result.data,
      pagination: result.pagination,
      message: 'My attendances retrieved successfully',
    };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOkResponse({
    description: 'Attendance detail retrieved successfully',
    type: AttendanceEntity,
  })
  async findById(@Param('id') id: string) {
    const data = await this.attendanceService.findById(id);

    return {
      data,
      message: 'Attendance detail retrieved successfully',
    };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOkResponse({
    description: 'Attendance updated successfully',
    type: AttendanceEntity,
  })
  async update(@Param('id') id: string, @Body() dto: UpdateAttendanceDto) {
    const data = await this.attendanceService.update(id, dto);

    return {
      data,
      message: 'Attendance updated successfully',
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOkResponse({
    description: 'Attendance deleted successfully',
    type: AttendanceEntity,
  })
  async remove(@Param('id') id: string) {
    const data = await this.attendanceService.remove(id);

    return {
      data,
      message: 'Attendance deleted successfully',
    };
  }
}
