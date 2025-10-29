import { PrismaClient, Role, PriceScope, PaymentStatus, PaymentMethod } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('proclinic123', 10);

  const [recepcao, gestor, profissional] = await Promise.all([
    prisma.user.upsert({
      where: { email: 'recepcao@local' },
      update: {},
      create: { name: 'Recepção', email: 'recepcao@local', role: Role.recepcao, passwordHash: password },
    }),
    prisma.user.upsert({
      where: { email: 'gestor@local' },
      update: {},
      create: { name: 'Gestor', email: 'gestor@local', role: Role.gestor, passwordHash: password },
    }),
    prisma.user.upsert({
      where: { email: 'dr@local' },
      update: {},
      create: { name: 'Dr. Profissional', email: 'dr@local', role: Role.profissional, passwordHash: password },
    }),
  ]);

  const patients = await prisma.$transaction(
    Array.from({ length: 5 }).map((_, i) =>
      prisma.patient.create({
        data: {
          name: `Paciente ${i + 1}`,
          document: `000.000.000-0${i}`,
          phone: `1199999000${i}`,
          consentGivenAt: new Date(),
        },
      }),
    ),
  );

  const items = await prisma.$transaction(
    Array.from({ length: 10 }).map((_, i) =>
      prisma.item.create({
        data: {
          name: `Item ${i + 1}`,
          category: i % 2 ? 'Medicamento' : 'Material',
          unit: i % 3 === 0 ? 'unidade' : i % 3 === 1 ? 'ml' : 'g',
          sku: `SKU-${i + 1}`,
          minStock: 5,
          isControlled: i % 5 === 0,
        },
      }),
    ),
  );

  // Create batches for first 6 items
  for (let i = 0; i < 6; i++) {
    const item = items[i];
    await prisma.itemBatch.create({
      data: {
        itemId: item.id,
        batchCode: `L${i + 1}`,
        expirationDate: new Date(Date.now() + (i + 1) * 30 * 24 * 3600 * 1000),
        unitCost: 25 + i * 2,
        quantityAvailable: 100,
      },
    });
  }

  const cleaning: any = [
    { itemSku: items[0].sku, quantity: 1 },
    { itemSku: items[1].sku, quantity: 5 },
  ];

  const procedureTypes = await prisma.$transaction([
    prisma.procedureType.create({
      data: {
        name: 'Consulta',
        description: 'Avaliação e consulta',
        defaultDurationMin: 30,
        defaultItems: cleaning,
      },
    }),
    prisma.procedureType.create({
      data: {
        name: 'Curativo',
        description: 'Curativo simples',
        defaultDurationMin: 20,
        defaultItems: cleaning,
      },
    }),
    prisma.procedureType.create({
      data: {
        name: 'Aplicação de Medicamento',
        description: 'Aplicação intramuscular',
        defaultDurationMin: 15,
        defaultItems: cleaning,
      },
    }),
    prisma.procedureType.create({
      data: {
        name: 'Fisioterapia',
        description: 'Sessão fisioterapia',
        defaultDurationMin: 50,
        defaultItems: cleaning,
      },
    }),
  ]);

  await prisma.priceRule.create({
    data: {
      scope: PriceScope.GLOBAL,
      marginTarget: 0.6,
      minMargin: 0.3,
      maxMargin: 0.8,
    },
  });

  // Create one scheduled procedure as example
  const proc = await prisma.procedure.create({
    data: {
      patientId: patients[0].id,
      professionalUserId: profissional.id,
      procedureTypeId: procedureTypes[0].id,
      scheduledAt: new Date(),
      room: 'Sala 1',
    },
  });

  await prisma.payment.create({
    data: {
      procedureId: proc.id,
      method: PaymentMethod.CARD,
      amount: 0,
      status: PaymentStatus.PENDING,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });














