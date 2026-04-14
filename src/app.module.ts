import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { EmployeeModule } from './modules/employee/employee.module';
import { AttendanceModule } from './modules/attendance/attendance.module';

@Module({
  imports: [AuthModule, EmployeeModule, AttendanceModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
