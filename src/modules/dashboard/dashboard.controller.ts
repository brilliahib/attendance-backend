import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/role.guard';
import { Roles } from '../../common/decorators/role.decorator';
import { Role } from '../../../generated/prisma/enums';
import { DashboardService } from './dashboard.service';
import { GetDashboardSummaryDto } from './dto/get-dashboard-summary.dto';
import { DashboardSummaryEntity } from './entities/dashboard-summary.entity';

@Controller('dashboard')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Roles(Role.ADMIN)
  @Get('summary')
  @ApiOkResponse({
    description: 'Dashboard summary retrieved successfully',
    type: DashboardSummaryEntity,
  })
  async summary(@Query() query: GetDashboardSummaryDto) {
    const data = await this.dashboardService.summary(query);

    return {
      data,
      message: 'Dashboard summary retrieved successfully',
    };
  }
}
