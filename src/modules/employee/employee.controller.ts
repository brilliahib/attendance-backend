import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { EmployeeService } from './employee.service';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { EmployeeEntity } from './entities/employee.entity';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Roles } from '../../common/decorators/role.decorator';
import { Role } from '../../../generated/prisma/enums';
import { RolesGuard } from '../../common/guards/role.guard';
import { GetAllEmployeeDto } from './dto/get-all-employee.dto';

@Controller('employees')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Roles(Role.ADMIN)
  @Get()
  @ApiOkResponse({
    description: 'Employees retrieved successfully',
    type: [EmployeeEntity],
  })
  async findAll(@Query() query: GetAllEmployeeDto) {
    const result = await this.employeeService.findAll(query);

    return {
      data: result.data,
      pagination: result.pagination,
      message: 'Employees retrieved successfully',
    };
  }

  @Roles(Role.ADMIN)
  @Get(':id')
  @ApiOkResponse({
    description: 'Employee detail retrieved successfully',
    type: EmployeeEntity,
  })
  async findOne(@Param('id') id: string) {
    const data = await this.employeeService.findOne(id);

    return {
      data,
      message: 'Employee detail retrieved successfully',
    };
  }

  @Roles(Role.ADMIN)
  @Patch(':id')
  @ApiOkResponse({
    description: 'Employee updated successfully',
    type: EmployeeEntity,
  })
  async update(@Param('id') id: string, @Body() dto: UpdateEmployeeDto) {
    const data = await this.employeeService.update(id, dto);

    return {
      data,
      message: 'Employee updated successfully',
    };
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  @ApiOkResponse({
    description: 'Employee deleted successfully',
    type: EmployeeEntity,
  })
  async remove(@Param('id') id: string) {
    const data = await this.employeeService.remove(id);

    return {
      data,
      message: 'Employee deleted successfully',
    };
  }
}
