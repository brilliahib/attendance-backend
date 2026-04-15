import * as bcrypt from 'bcrypt';
import { PrismaClient, Role } from '../generated/prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

const adapter = new PrismaMariaDb(process.env.DATABASE_URL!);

const prisma = new PrismaClient({
  adapter,
  log: ['info', 'warn', 'error'],
});

async function main() {
  console.log('🌱 Seeding database...');

  const hashedPassword = await bcrypt.hash('password123', 10);

  function randomCheckIn(base: Date): Date {
    const d = new Date(base);
    const totalSeconds = 30 * 60;
    const randomSeconds = Math.floor(Math.random() * totalSeconds);
    d.setHours(7, 30 + Math.floor(randomSeconds / 60), randomSeconds % 60, 0);
    return d;
  }

  function randomCheckOut(base: Date): Date {
    const d = new Date(base);
    const totalSeconds = 120 * 60;
    const randomSeconds = Math.floor(Math.random() * totalSeconds);
    d.setHours(16, Math.floor(randomSeconds / 60), randomSeconds % 60, 0);
    return d;
  }

  const workDate = new Date();
  workDate.setDate(workDate.getDate() - 1);
  workDate.setHours(0, 0, 0, 0);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@mail.com' },
    update: {},
    create: {
      email: 'admin@mail.com',
      password: hashedPassword,
      role: Role.ADMIN,
      isActive: true,
      employee: {
        create: {
          employeeCode: 'EMP-000',
          fullName: 'Admin HR',
          phone: '081234567000',
          department: 'Human Resources',
          position: 'HR Manager',
          joinDate: new Date('2020-01-01'),
          address: 'Head Office',
        },
      },
    },
    include: { employee: true },
  });

  console.log('✅ Admin created: admin@mail.com');

  const employeeData: {
    email: string;
    employeeCode: string;
    fullName: string;
    phone: string;
    department: string;
    position: string;
    joinDate: Date;
    address: string;
  }[] = [
    {
      email: 'budi.santoso@mail.com',
      employeeCode: 'EMP-001',
      fullName: 'Budi Santoso',
      phone: '081234567001',
      department: 'Engineering',
      position: 'Backend Developer',
      joinDate: new Date('2022-03-01'),
      address: 'Jl. Mawar No. 1, Klaten',
    },
    {
      email: 'siti.rahayu@mail.com',
      employeeCode: 'EMP-002',
      fullName: 'Siti Rahayu',
      phone: '081234567002',
      department: 'Engineering',
      position: 'Frontend Developer',
      joinDate: new Date('2022-05-15'),
      address: 'Jl. Melati No. 2, Klaten',
    },
    {
      email: 'agus.prasetyo@mail.com',
      employeeCode: 'EMP-003',
      fullName: 'Agus Prasetyo',
      phone: '081234567003',
      department: 'Human Resources',
      position: 'HR Manager',
      joinDate: new Date('2021-08-10'),
      address: 'Jl. Anggrek No. 3, Klaten',
    },
    {
      email: 'dewi.lestari@mail.com',
      employeeCode: 'EMP-004',
      fullName: 'Dewi Lestari',
      phone: '081234567004',
      department: 'Finance',
      position: 'Accountant',
      joinDate: new Date('2023-01-05'),
      address: 'Jl. Dahlia No. 4, Klaten',
    },
    {
      email: 'riko.firmansyah@mail.com',
      employeeCode: 'EMP-005',
      fullName: 'Riko Firmansyah',
      phone: '081234567005',
      department: 'Engineering',
      position: 'DevOps Engineer',
      joinDate: new Date('2022-09-20'),
      address: 'Jl. Kamboja No. 5, Klaten',
    },
    {
      email: 'rina.wulandari@mail.com',
      employeeCode: 'EMP-006',
      fullName: 'Rina Wulandari',
      phone: '081234567006',
      department: 'Marketing',
      position: 'Marketing Specialist',
      joinDate: new Date('2023-03-12'),
      address: 'Jl. Kenanga No. 6, Klaten',
    },
    {
      email: 'hendra.kurniawan@mail.com',
      employeeCode: 'EMP-007',
      fullName: 'Hendra Kurniawan',
      phone: '081234567007',
      department: 'Engineering',
      position: 'Mobile Developer',
      joinDate: new Date('2022-07-18'),
      address: 'Jl. Flamboyan No. 7, Klaten',
    },
    {
      email: 'maya.indraswari@mail.com',
      employeeCode: 'EMP-008',
      fullName: 'Maya Indraswari',
      phone: '081234567008',
      department: 'Design',
      position: 'UI/UX Designer',
      joinDate: new Date('2023-06-01'),
      address: 'Jl. Teratai No. 8, Klaten',
    },
    {
      email: 'fajar.nugroho@mail.com',
      employeeCode: 'EMP-009',
      fullName: 'Fajar Nugroho',
      phone: '081234567009',
      department: 'Finance',
      position: 'Finance Analyst',
      joinDate: new Date('2021-11-22'),
      address: 'Jl. Tulip No. 9, Klaten',
    },
    {
      email: 'linda.permatasari@mail.com',
      employeeCode: 'EMP-010',
      fullName: 'Linda Permatasari',
      phone: '081234567010',
      department: 'Human Resources',
      position: 'Recruiter',
      joinDate: new Date('2022-04-07'),
      address: 'Jl. Cempaka No. 10, Klaten',
    },
    {
      email: 'wahyu.setiawan@mail.com',
      employeeCode: 'EMP-011',
      fullName: 'Wahyu Setiawan',
      phone: '081234567011',
      department: 'Engineering',
      position: 'QA Engineer',
      joinDate: new Date('2023-02-14'),
      address: 'Jl. Bougenville No. 11, Klaten',
    },
    {
      email: 'nurul.hidayah@mail.com',
      employeeCode: 'EMP-012',
      fullName: 'Nurul Hidayah',
      phone: '081234567012',
      department: 'Marketing',
      position: 'Content Writer',
      joinDate: new Date('2023-08-01'),
      address: 'Jl. Lily No. 12, Klaten',
    },
    {
      email: 'taufik.hidayat@mail.com',
      employeeCode: 'EMP-013',
      fullName: 'Taufik Hidayat',
      phone: '081234567013',
      department: 'Design',
      position: 'Graphic Designer',
      joinDate: new Date('2022-12-05'),
      address: 'Jl. Sakura No. 13, Klaten',
    },
    {
      email: 'putri.anggraini@mail.com',
      employeeCode: 'EMP-014',
      fullName: 'Putri Anggraini',
      phone: '081234567014',
      department: 'Operations',
      position: 'Operations Staff',
      joinDate: new Date('2023-04-20'),
      address: 'Jl. Lavender No. 14, Klaten',
    },
    {
      email: 'denny.ardiansyah@mail.com',
      employeeCode: 'EMP-015',
      fullName: 'Denny Ardiansyah',
      phone: '081234567015',
      department: 'Operations',
      position: 'Operations Manager',
      joinDate: new Date('2021-06-15'),
      address: 'Jl. Jasmine No. 15, Klaten',
    },
  ];

  for (const emp of employeeData) {
    const user = await prisma.user.upsert({
      where: { email: emp.email },
      update: {},
      create: {
        email: emp.email,
        password: hashedPassword,
        role: Role.EMPLOYEE,
        isActive: true,
        employee: {
          create: {
            employeeCode: emp.employeeCode,
            fullName: emp.fullName,
            phone: emp.phone,
            department: emp.department,
            position: emp.position,
            joinDate: emp.joinDate,
            address: emp.address,
          },
        },
      },
      include: { employee: true },
    });
    console.log(`✅ Employee created: ${emp.fullName} (${emp.email})`);

    const checkInAt = randomCheckIn(workDate);
    const checkOutAt = randomCheckOut(workDate);

    if (user.employee) {
      await prisma.attendance.upsert({
        where: {
          employeeId_workDate: {
            employeeId: user.employee.id,
            workDate,
          },
        },
        update: {},
        create: {
          employeeId: user.employee.id,
          workDate,
          checkInAt,
          photoCheckInUrl: `/uploads/attendance/checkin.jpg`,
          checkInNote: 'Absen masuk',
          checkOutAt,
          photoCheckOutUrl: `/uploads/attendance/checkout.jpg`,
          checkOutNote: 'Absen pulang',
        },
      });
      console.log(
        `   📅 Attendance seeded for ${emp.fullName} — in: ${checkInAt.toTimeString().slice(0, 5)}, out: ${checkOutAt.toTimeString().slice(0, 5)}`,
      );
    }
  }

  console.log('\n🎉 Seeding completed!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Admin     : admin@mail.com / password123');
  console.log('Employee  : [nama]@mail.com / password123  (15 akun)');
  console.log('Attendance: 1 hari × 15 karyawan = 15 records');
  console.log('Check-in  : 07:30 – 08:00');
  console.log('Check-out : 16:00 – 18:00');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
