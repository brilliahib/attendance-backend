import { Injectable } from '@nestjs/common';
import { Prisma, Role } from '../../../generated/prisma/client';
import { PrismaService } from '../../infra/database/prisma/prisma.service';
import { GetDashboardSummaryDto } from './dto/get-dashboard-summary.dto';
import { DashboardSummaryEntity } from './entities/dashboard-summary.entity';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  private formatAverageTime(value: unknown): string | null {
    if (value === null || value === undefined) return null;

    const seconds = Number(value);
    if (!Number.isFinite(seconds)) return null;

    const totalSeconds = Math.round(seconds);
    const hours = Math.floor(totalSeconds / 3600) % 24;
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  }

  private buildAttendanceConditions(
    filter: GetDashboardSummaryDto,
    options?: { includeCheckoutOnly?: boolean },
  ): Prisma.Sql {
    const conditions: Prisma.Sql[] = [
      Prisma.sql`e.deleted_at IS NULL`,
      Prisma.sql`u.deleted_at IS NULL`,
      Prisma.sql`u.role = ${Role.EMPLOYEE}`,
    ];

    if (filter.fromDate) {
      const fromDate = new Date(filter.fromDate);
      fromDate.setHours(0, 0, 0, 0);
      conditions.push(Prisma.sql`a.workDate >= ${fromDate}`);
    }

    if (filter.toDate) {
      const toDate = new Date(filter.toDate);
      toDate.setHours(23, 59, 59, 999);
      conditions.push(Prisma.sql`a.workDate <= ${toDate}`);
    }

    if (options?.includeCheckoutOnly) {
      conditions.push(Prisma.sql`a.check_out_at IS NOT NULL`);
    }

    return Prisma.join(conditions, ' AND ');
  }

  async summary(
    filter: GetDashboardSummaryDto,
  ): Promise<DashboardSummaryEntity> {
    const baseWhere = this.buildAttendanceConditions(filter);
    const checkoutWhere = this.buildAttendanceConditions(filter, {
      includeCheckoutOnly: true,
    });

    const [totalEmployees, avgCheckInRows, avgCheckOutRows] = await Promise.all(
      [
        this.prisma.employee.count({
          where: {
            deletedAt: null,
            user: {
              role: Role.EMPLOYEE,
              deletedAt: null,
            },
          },
        }),

        this.prisma.$queryRaw<Array<{ averageSeconds: unknown }>>(Prisma.sql`
  SELECT AVG(TIME_TO_SEC(TIME(CONVERT_TZ(a.check_in_at, '+00:00', '+07:00')))) AS averageSeconds
  FROM \`attendance\` a
  INNER JOIN \`employee\` e ON e.id = a.employee_id
  INNER JOIN \`user\` u ON u.id = e.user_id
  WHERE ${baseWhere}
`),

        this.prisma.$queryRaw<Array<{ averageSeconds: unknown }>>(Prisma.sql`
  SELECT AVG(TIME_TO_SEC(TIME(CONVERT_TZ(a.check_out_at, '+00:00', '+07:00')))) AS averageSeconds
  FROM \`attendance\` a
  INNER JOIN \`employee\` e ON e.id = a.employee_id
  INNER JOIN \`user\` u ON u.id = e.user_id
  WHERE ${checkoutWhere}
`),
      ],
    );

    return new DashboardSummaryEntity({
      totalEmployees,
      averageCheckinTime: this.formatAverageTime(
        avgCheckInRows[0]?.averageSeconds,
      ),
      averageCheckoutTime: this.formatAverageTime(
        avgCheckOutRows[0]?.averageSeconds,
      ),
    });
  }
}
