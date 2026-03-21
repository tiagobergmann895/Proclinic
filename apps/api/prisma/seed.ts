import { PrismaClient } from '@prisma/client';
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = bcrypt.hashSync('123456', 10);

  const user = await prisma.user.upsert({
    where: { email: 'admin@mediflow.com' },
    update: { password: hashedPassword },
    create: {
      email: 'admin@mediflow.com',
      password: hashedPassword,
    },
  });

  const tenant = await prisma.tenant.create({
    data: {
      name: 'MediFlow Clinic Principal',
    }
  });

  await prisma.userMembership.create({
    data: {
      userId: user.id,
      tenantId: tenant.id,
      role: 'ADMIN'
    }
  });

  const prof = await prisma.professional.create({
    data: {
      tenantId: tenant.id,
      userId: user.id,
      name: 'Dr. Admin',
      specialty: 'Odontologia Geral e Estética'
    }
  });

  const patient = await prisma.patient.create({
    data: {
      tenantId: tenant.id,
      name: 'Clara Rodrigues',
      email: 'clara.rodrigues@example.com',
      phone: '11999999999',
      cpf: '123.456.789-00'
    }
  });

  await prisma.patient.create({
    data: {
      tenantId: tenant.id,
      name: 'Carlos Mendes (Retorno)',
      email: 'carlos@example.com',
      phone: '11988888888',
      cpf: '987.654.321-00'
    }
  });

  await prisma.product.create({
    data: {
      tenantId: tenant.id,
      name: 'Seringa Descartável 10ml (C/ Agulha)',
      category: 'CLINICAL',
      unit: 'CX',
      minStock: 15,
      currentStock: 45
    }
  });

  await prisma.product.create({
    data: {
      tenantId: tenant.id,
      name: 'Anestésico Lidocaína 2%',
      category: 'PHARMA',
      unit: 'CX',
      minStock: 20,
      currentStock: 5
    }
  });

  console.log('Seed populado com sucesso: admin@mediflow.com / 123456');
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })