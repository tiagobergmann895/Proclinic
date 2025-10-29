-- Criar tabelas básicas do Proclinic
CREATE TABLE IF NOT EXISTS "User" (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "Patient" (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    "birthDate" TIMESTAMP,
    document TEXT UNIQUE,
    phone TEXT,
    email TEXT,
    address TEXT,
    "consentGivenAt" TIMESTAMP,
    notes TEXT,
    "createdAt" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "Item" (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT,
    unit TEXT NOT NULL,
    sku TEXT UNIQUE,
    "minStock" DECIMAL DEFAULT 0,
    "isControlled" BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "ItemBatch" (
    id TEXT PRIMARY KEY,
    "itemId" TEXT NOT NULL,
    "batchCode" TEXT NOT NULL,
    "expirationDate" TIMESTAMP,
    "unitCost" DECIMAL(12,2) NOT NULL,
    "quantityAvailable" DECIMAL(14,3) NOT NULL,
    "createdAt" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "InventoryMovement" (
    id TEXT PRIMARY KEY,
    "itemId" TEXT NOT NULL,
    "batchId" TEXT,
    type TEXT NOT NULL,
    quantity DECIMAL(14,3) NOT NULL,
    "unitCost" DECIMAL(12,2),
    reason TEXT,
    "linkedProcedureId" TEXT,
    "performedByUserId" TEXT NOT NULL,
    "createdAt" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "ProcedureType" (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    "defaultDurationMin" INTEGER NOT NULL,
    "defaultItems" JSONB NOT NULL
);

CREATE TABLE IF NOT EXISTS "Procedure" (
    id TEXT PRIMARY KEY,
    "patientId" TEXT NOT NULL,
    "professionalUserId" TEXT NOT NULL,
    "procedureTypeId" TEXT NOT NULL,
    "scheduledAt" TIMESTAMP NOT NULL,
    "startedAt" TIMESTAMP,
    "finishedAt" TIMESTAMP,
    room TEXT,
    status TEXT DEFAULT 'SCHEDULED',
    notes TEXT
);

CREATE TABLE IF NOT EXISTS "CostSheet" (
    id TEXT PRIMARY KEY,
    "procedureId" TEXT UNIQUE NOT NULL,
    "itemsCost" DECIMAL(12,2) NOT NULL,
    "laborCost" DECIMAL(12,2) NOT NULL,
    "overheadCost" DECIMAL(12,2) NOT NULL,
    "totalCost" DECIMAL(12,2) NOT NULL,
    "marginTarget" DECIMAL(5,4) NOT NULL,
    "suggestedPrice" DECIMAL(12,2) NOT NULL,
    "createdAt" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "PriceRule" (
    id TEXT PRIMARY KEY,
    scope TEXT NOT NULL,
    "scopeId" TEXT,
    "marginTarget" DECIMAL(5,4) NOT NULL,
    "minMargin" DECIMAL(5,4) NOT NULL,
    "maxMargin" DECIMAL(5,4) NOT NULL,
    "dynamicAdjustments" JSONB
);

CREATE TABLE IF NOT EXISTS "Payment" (
    id TEXT PRIMARY KEY,
    "procedureId" TEXT NOT NULL,
    method TEXT NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    status TEXT DEFAULT 'PENDING',
    "paidAt" TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "AuditLog" (
    id TEXT PRIMARY KEY,
    "userId" TEXT,
    action TEXT NOT NULL,
    entity TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    metadata JSONB,
    "createdAt" TIMESTAMP DEFAULT NOW()
);

-- Criar índices
CREATE INDEX IF NOT EXISTS idx_user_email ON "User"(email);
CREATE INDEX IF NOT EXISTS idx_patient_document ON "Patient"(document);
CREATE INDEX IF NOT EXISTS idx_item_sku ON "Item"(sku);
CREATE INDEX IF NOT EXISTS idx_procedure_scheduled ON "Procedure"("scheduledAt");
CREATE INDEX IF NOT EXISTS idx_procedure_patient ON "Procedure"("patientId");
CREATE INDEX IF NOT EXISTS idx_procedure_professional ON "Procedure"("professionalUserId");



