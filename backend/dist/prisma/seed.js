"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function main() {
    const password = await bcryptjs_1.default.hash('proclinic123', 10);
    const [recepcao, gestor, profissional] = await Promise.all([
        prisma.user.upsert({
            where: { email: 'recepcao@local' },
            update: {},
            create: { name: 'Recepção', email: 'recepcao@local', role: client_1.Role.recepcao, passwordHash: password },
        }),
        prisma.user.upsert({
            where: { email: 'gestor@local' },
            update: {},
            create: { name: 'Gestor', email: 'gestor@local', role: client_1.Role.gestor, passwordHash: password },
        }),
        prisma.user.upsert({
            where: { email: 'dr@local' },
            update: {},
            create: { name: 'Dr. Profissional', email: 'dr@local', role: client_1.Role.profissional, passwordHash: password },
        }),
    ]);
    const patients = await prisma.$transaction(Array.from({ length: 5 }).map((_, i) => prisma.patient.create({
        data: {
            name: `Paciente ${i + 1}`,
            document: `000.000.000-0${i}`,
            phone: `1199999000${i}`,
            consentGivenAt: new Date(),
        },
    })));
    const items = await prisma.$transaction(Array.from({ length: 10 }).map((_, i) => prisma.item.create({
        data: {
            name: `Item ${i + 1}`,
            category: i % 2 ? 'Medicamento' : 'Material',
            unit: i % 3 === 0 ? 'unidade' : i % 3 === 1 ? 'ml' : 'g',
            sku: `SKU-${i + 1}`,
            minStock: 5,
            isControlled: i % 5 === 0,
        },
    })));
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
    const cleaning = [
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
            scope: client_1.PriceScope.GLOBAL,
            marginTarget: 0.6,
            minMargin: 0.3,
            maxMargin: 0.8,
        },
    });
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
            method: client_1.PaymentMethod.CARD,
            amount: 0,
            status: client_1.PaymentStatus.PENDING,
        },
    });
}
main()
    .then(async () => {
    await prisma.$disconnect();
})
    .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
});
//# sourceMappingURL=seed.js.map