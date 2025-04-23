import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Hash the default password "1234" once
  const defaultPassword = await bcrypt.hash('1234', 10);

  const users = [
    {
      name: 'RAMESHA M',
      email: 'ramesh_m@cdot.in',
      avatar: 'RM',
      password: defaultPassword
    },
    {
      name: 'KING SOLOMON',
      email: 'solomon@cdot.in',
      avatar: 'KS',
      password: defaultPassword
    },
    {
      name: 'ANANDAMMA',
      email: 'anandam@cdot.in',
      avatar: 'AN',
      password: defaultPassword
    },
    {
      name: 'KRISHNAKUMAR G',
      email: 'gkkumar@cdot.in',
      avatar: 'KG',
      password: defaultPassword
    },
    {
      name: 'THAMILARASAN S',
      email: 'sthamil@cdot.in',
      avatar: 'TS',
      password: defaultPassword
    },
    {
      name: 'GOPA KUMAR K R',
      email: 'gopan@cdot.in',
      avatar: 'GK',
      password: defaultPassword
    },
    {
      name: 'LATA KIRAN DEY',
      email: 'latak@cdot.in',
      avatar: 'LD',
      password: defaultPassword
    },
    {
      name: 'KJ Rajkumar',
      email: 'kjr@cdot.in',
      avatar: 'KR',
      password: defaultPassword
    },
    {
      name: 'SUBRAMANYA B P',
      email: 'subha@cdot.in',
      avatar: 'SB',
      password: defaultPassword
    },
    {
      name: 'CHANEMOUGAM R',
      email: 'chan@cdot.in',
      avatar: 'CR',
      password: defaultPassword
    },
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {
        password: user.password // Update password if user exists
      },
      create: {
        name: user.name,
        email: user.email,
        password: user.password,
        avatar: user.avatar,
      },
    });
  }

  console.log('Database seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });