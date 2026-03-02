import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const tenantName = 'ProClinic';
  const adminEmail = 'admin@proclinic.local';
  const adminPassword = 'Admin@123';

  const passwordHash = await bcrypt.hash(adminPassword, 10);

  const tenant = await prisma.tenant.upsert({
    where: { id: 'seed-tenant' },
    update: { name: tenantName },
    create: {
      id: 'seed-tenant',
      name: tenantName,
    },
  });

  const user = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      password: passwordHash,
    },
  });

  await prisma.userMembership.upsert({
    where: { userId_tenantId: { userId: user.id, tenantId: tenant.id } },
    update: { role: 'owner' },
    create: {
      userId: user.id,
      tenantId: tenant.id,
      role: 'owner',
    },
  });

  console.log('Seed OK');
  console.log('Tenant:', tenant.name);
  console.log('Admin:', adminEmail);
  console.log('Password:', adminPassword);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });