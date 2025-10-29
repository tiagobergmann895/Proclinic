"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EhrService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/prisma.service");
const audit_service_1 = require("./audit.service");
const crypto = __importStar(require("crypto"));
let EhrService = class EhrService {
    constructor(prisma, audit) {
        this.prisma = prisma;
        this.audit = audit;
    }
    async getPatientTimeline(patientId, userId, tenantId, options) {
        await this.checkAccess(userId, tenantId, 'Patient', patientId, 'READ');
        await this.audit.log({
            tenantId,
            userId,
            action: 'READ',
            resourceType: 'Patient',
            resourceId: patientId,
            description: 'Visualizou timeline do paciente',
            accessPurpose: 'treatment',
        });
        const { from, to, types, page = 1, pageSize = 50 } = options;
        const skip = (page - 1) * pageSize;
        const timeline = [];
        if (!types || types.includes('encounters')) {
            const encounters = await this.prisma.encounter.findMany({
                where: {
                    patientId,
                    tenantId,
                    ...(from || to ? {
                        scheduledStart: {
                            gte: from,
                            lte: to,
                        }
                    } : {}),
                },
                include: {
                    practitioner: { select: { name: true, specialty: true } },
                },
                orderBy: { scheduledStart: 'desc' },
                take: pageSize,
                skip,
            });
            timeline.push(...encounters.map(e => ({
                type: 'encounter',
                id: e.id,
                date: e.scheduledStart,
                title: `Consulta - ${e.serviceType || 'Atendimento'}`,
                practitioner: e.practitioner.name,
                specialty: e.practitioner.specialty,
                status: e.status,
                data: e,
            })));
        }
        if (!types || types.includes('notes')) {
            const notes = await this.prisma.clinicalNote.findMany({
                where: {
                    patientId,
                    tenantId,
                    ...(from || to ? {
                        documentDate: {
                            gte: from,
                            lte: to,
                        }
                    } : {}),
                },
                include: {
                    author: { select: { name: true } },
                },
                orderBy: { documentDate: 'desc' },
                take: pageSize,
                skip,
            });
            timeline.push(...notes.map(n => ({
                type: 'clinical_note',
                id: n.id,
                date: n.documentDate,
                title: `Evolução - ${n.type}`,
                author: n.author.name,
                status: n.status,
                summary: n.summary,
                data: n,
            })));
        }
        if (!types || types.includes('observations')) {
            const observations = await this.prisma.observation.findMany({
                where: {
                    patientId,
                    ...(from || to ? {
                        effectiveDateTime: {
                            gte: from,
                            lte: to,
                        }
                    } : {}),
                },
                orderBy: { effectiveDateTime: 'desc' },
                take: pageSize,
                skip,
            });
            timeline.push(...observations.map(o => ({
                type: 'observation',
                id: o.id,
                date: o.effectiveDateTime,
                title: o.display,
                value: o.valueQuantity ? `${o.valueQuantity} ${o.valueUnit}` : o.valueString,
                category: o.category,
                data: o,
            })));
        }
        if (!types || types.includes('prescriptions')) {
            const prescriptions = await this.prisma.prescription.findMany({
                where: {
                    patientId,
                    tenantId,
                    ...(from || to ? {
                        authoredOn: {
                            gte: from,
                            lte: to,
                        }
                    } : {}),
                },
                include: {
                    prescriber: { select: { name: true } },
                },
                orderBy: { authoredOn: 'desc' },
                take: pageSize,
                skip,
            });
            timeline.push(...prescriptions.map(p => ({
                type: 'prescription',
                id: p.id,
                date: p.authoredOn,
                title: 'Prescrição Médica',
                prescriber: p.prescriber.name,
                status: p.status,
                data: p,
            })));
        }
        if (!types || types.includes('diagnosticReports')) {
            const reports = await this.prisma.diagnosticReport.findMany({
                where: {
                    patientId,
                    tenantId,
                    ...(from || to ? {
                        issued: {
                            gte: from,
                            lte: to,
                        }
                    } : {}),
                },
                orderBy: { issued: 'desc' },
                take: pageSize,
                skip,
            });
            timeline.push(...reports.map(r => ({
                type: 'diagnostic_report',
                id: r.id,
                date: r.issued,
                title: `Exame - ${r.display}`,
                category: r.category,
                status: r.status,
                data: r,
            })));
        }
        timeline.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        return {
            timeline: timeline.slice(0, pageSize),
            total: timeline.length,
            page,
            pageSize,
        };
    }
    async createSoapNote(data, userId, tenantId) {
        await this.checkAccess(userId, tenantId, 'Patient', data.patientId, 'WRITE');
        const note = await this.prisma.clinicalNote.create({
            data: {
                tenantId,
                patientId: data.patientId,
                encounterId: data.encounterId,
                authorId: userId,
                type: 'SOAP',
                status: 'DRAFT',
                subjective: data.subjective,
                objective: data.objective,
                assessment: data.assessment,
                plan: data.plan,
                title: data.title || 'Evolução SOAP',
                summary: this.generateSummary(data),
                documentDate: new Date(),
            },
        });
        await this.audit.log({
            tenantId,
            userId,
            action: 'CREATE',
            resourceType: 'ClinicalNote',
            resourceId: note.id,
            description: 'Criou evolução SOAP',
        });
        return note;
    }
    async signClinicalNote(noteId, userId, tenantId) {
        const note = await this.prisma.clinicalNote.findUnique({
            where: { id: noteId },
        });
        if (!note || note.tenantId !== tenantId) {
            throw new common_1.NotFoundException('Note not found');
        }
        if (note.authorId !== userId) {
            throw new common_1.ForbiddenException('Only the author can sign the note');
        }
        const content = JSON.stringify({
            subjective: note.subjective,
            objective: note.objective,
            assessment: note.assessment,
            plan: note.plan,
            documentDate: note.documentDate,
        });
        const hash = crypto.createHash('sha256').update(content).digest('hex');
        const updated = await this.prisma.clinicalNote.update({
            where: { id: noteId },
            data: {
                status: 'FINAL',
                signedAt: new Date(),
                signatureHash: hash,
            },
        });
        await this.audit.log({
            tenantId,
            userId,
            action: 'UPDATE',
            resourceType: 'ClinicalNote',
            resourceId: noteId,
            description: 'Assinou evolução clínica',
        });
        return updated;
    }
    async recordVitalSigns(data, userId, tenantId) {
        await this.checkAccess(userId, tenantId, 'Patient', data.patientId, 'WRITE');
        const observations = await Promise.all(data.vitalSigns.map(vs => this.prisma.observation.create({
            data: {
                patientId: data.patientId,
                encounterId: data.encounterId,
                performerId: userId,
                code: vs.code,
                codeSystem: 'http://loinc.org',
                display: vs.display,
                category: 'vital-signs',
                valueQuantity: vs.value,
                valueUnit: vs.unit,
                status: 'FINAL',
                effectiveDateTime: new Date(),
                interpretation: this.interpretVitalSign(vs.code, vs.value),
            },
        })));
        await this.audit.log({
            tenantId,
            userId,
            action: 'CREATE',
            resourceType: 'Observation',
            description: `Registrou ${observations.length} sinais vitais`,
        });
        return observations;
    }
    interpretVitalSign(code, value) {
        const ranges = {
            '8310-5': { low: 36.1, high: 37.2 },
            '8867-4': { low: 60, high: 100 },
            '9279-1': { low: 12, high: 20 },
            '8480-6': { low: 90, high: 120 },
            '8462-4': { low: 60, high: 80 },
        };
        const range = ranges[code];
        if (!range)
            return 'normal';
        if (value < range.low)
            return 'low';
        if (value > range.high)
            return 'high';
        return 'normal';
    }
    async createPrescription(data, userId, tenantId) {
        await this.checkAccess(userId, tenantId, 'Patient', data.patientId, 'WRITE');
        const allergies = await this.prisma.allergyIntolerance.findMany({
            where: {
                patientId: data.patientId,
                clinicalStatus: 'active',
                category: 'MEDICATION',
            },
        });
        const warnings = [];
        for (const item of data.items) {
            for (const allergy of allergies) {
                if (item.medication.toLowerCase().includes(allergy.display.toLowerCase())) {
                    warnings.push({
                        severity: allergy.criticality,
                        message: `ALERTA: Paciente alérgico a ${allergy.display}`,
                        medication: item.medication,
                    });
                }
            }
        }
        const criticalAllergies = warnings.filter(w => w.severity === 'HIGH');
        if (criticalAllergies.length > 0) {
            throw new common_1.ForbiddenException({
                message: 'Prescrição bloqueada por alergia crítica',
                allergies: criticalAllergies,
            });
        }
        const prescription = await this.prisma.prescription.create({
            data: {
                tenantId,
                patientId: data.patientId,
                encounterId: data.encounterId,
                prescriberId: userId,
                status: 'DRAFT',
                items: data.items,
                notes: data.notes,
                authoredOn: new Date(),
            },
        });
        await this.audit.log({
            tenantId,
            userId,
            action: 'CREATE',
            resourceType: 'Prescription',
            resourceId: prescription.id,
            description: 'Criou prescrição',
        });
        return {
            prescription,
            warnings: warnings.length > 0 ? warnings : undefined,
        };
    }
    async signPrescription(prescriptionId, userId, tenantId) {
        const prescription = await this.prisma.prescription.findUnique({
            where: { id: prescriptionId },
        });
        if (!prescription || prescription.tenantId !== tenantId) {
            throw new common_1.NotFoundException('Prescription not found');
        }
        if (prescription.prescriberId !== userId) {
            throw new common_1.ForbiddenException('Only the prescriber can sign');
        }
        const updated = await this.prisma.prescription.update({
            where: { id: prescriptionId },
            data: {
                status: 'ACTIVE',
                signedAt: new Date(),
            },
        });
        await this.audit.log({
            tenantId,
            userId,
            action: 'UPDATE',
            resourceType: 'Prescription',
            resourceId: prescriptionId,
            description: 'Assinou prescrição',
        });
        return updated;
    }
    async uploadDocument(file, metadata, userId, tenantId) {
        await this.checkAccess(userId, tenantId, 'Patient', metadata.patientId, 'WRITE');
        const fileUrl = `storage://${tenantId}/${metadata.patientId}/${file.filename}`;
        const fileHash = crypto.createHash('sha256').update(file.buffer).digest('hex');
        const document = await this.prisma.documentReference.create({
            data: {
                tenantId,
                patientId: metadata.patientId,
                encounterId: metadata.encounterId,
                type: metadata.type,
                fileName: file.filename,
                mimeType: file.mimetype,
                fileSize: file.size,
                fileUrl,
                fileHash,
                title: metadata.title,
                description: metadata.description,
                authorId: userId,
                documentDate: new Date(),
            },
        });
        await this.audit.log({
            tenantId,
            userId,
            action: 'CREATE',
            resourceType: 'DocumentReference',
            resourceId: document.id,
            description: `Upload de documento: ${file.filename}`,
        });
        return document;
    }
    async getPresignedDownloadUrl(documentId, userId, tenantId) {
        const document = await this.prisma.documentReference.findUnique({
            where: { id: documentId },
        });
        if (!document || document.tenantId !== tenantId) {
            throw new common_1.NotFoundException('Document not found');
        }
        await this.checkAccess(userId, tenantId, 'Patient', document.patientId, 'READ');
        await this.audit.log({
            tenantId,
            userId,
            action: 'READ',
            resourceType: 'DocumentReference',
            resourceId: documentId,
            description: `Baixou documento: ${document.fileName}`,
        });
        const presignedUrl = document.fileUrl + '?expires=3600';
        return { url: presignedUrl, expiresIn: 3600 };
    }
    async exportPatientBundle(patientId, userId, tenantId) {
        await this.checkAccess(userId, tenantId, 'Patient', patientId, 'EXPORT');
        const patient = await this.prisma.patient.findUnique({
            where: { id: patientId },
            include: {
                conditions: true,
                allergies: true,
                medications: true,
                immunizations: true,
                observations: { take: 100, orderBy: { effectiveDateTime: 'desc' } },
                clinicalNotes: { take: 50, orderBy: { documentDate: 'desc' } },
                prescriptions: { take: 50, orderBy: { authoredOn: 'desc' } },
            },
        });
        if (!patient || patient.tenantId !== tenantId) {
            throw new common_1.NotFoundException('Patient not found');
        }
        const bundle = {
            resourceType: 'Bundle',
            type: 'collection',
            timestamp: new Date().toISOString(),
            entry: [
                this.mapPatientToFhir(patient),
                ...patient.conditions.map(c => this.mapConditionToFhir(c)),
                ...patient.allergies.map(a => this.mapAllergyToFhir(a)),
                ...patient.medications.map(m => this.mapMedicationToFhir(m)),
                ...patient.immunizations.map(i => this.mapImmunizationToFhir(i)),
                ...patient.observations.map(o => this.mapObservationToFhir(o)),
            ],
        };
        await this.audit.log({
            tenantId,
            userId,
            action: 'EXPORT',
            resourceType: 'Patient',
            resourceId: patientId,
            description: 'Exportou prontuário completo (FHIR Bundle)',
            accessPurpose: 'export',
        });
        return bundle;
    }
    mapPatientToFhir(patient) {
        var _a, _b;
        return {
            fullUrl: `Patient/${patient.id}`,
            resource: {
                resourceType: 'Patient',
                id: patient.id,
                identifier: [
                    { system: 'CPF', value: patient.cpf },
                    { system: 'CNS', value: patient.cns },
                ].filter(i => i.value),
                name: [{ text: patient.name }],
                gender: (_a = patient.gender) === null || _a === void 0 ? void 0 : _a.toLowerCase(),
                birthDate: (_b = patient.birthDate) === null || _b === void 0 ? void 0 : _b.toISOString().split('T')[0],
                telecom: [
                    { system: 'phone', value: patient.phone },
                    { system: 'email', value: patient.email },
                ].filter(t => t.value),
                address: patient.address ? [patient.address] : [],
                active: patient.isActive,
                deceasedBoolean: patient.isDeceased,
            },
        };
    }
    mapConditionToFhir(condition) {
        var _a, _b;
        return {
            fullUrl: `Condition/${condition.id}`,
            resource: {
                resourceType: 'Condition',
                id: condition.id,
                clinicalStatus: {
                    coding: [{
                            system: 'http://terminology.hl7.org/CodeSystem/condition-clinical',
                            code: condition.clinicalStatus.toLowerCase(),
                        }],
                },
                code: {
                    coding: [{
                            system: condition.codeSystem,
                            code: condition.code,
                            display: condition.display,
                        }],
                },
                subject: { reference: `Patient/${condition.patientId}` },
                onsetDateTime: (_a = condition.onsetDateTime) === null || _a === void 0 ? void 0 : _a.toISOString(),
                abatementDateTime: (_b = condition.abatementDateTime) === null || _b === void 0 ? void 0 : _b.toISOString(),
                recordedDate: condition.recordedDate.toISOString(),
            },
        };
    }
    mapAllergyToFhir(allergy) {
        return {
            fullUrl: `AllergyIntolerance/${allergy.id}`,
            resource: {
                resourceType: 'AllergyIntolerance',
                id: allergy.id,
                clinicalStatus: {
                    coding: [{
                            system: 'http://terminology.hl7.org/CodeSystem/allergyintolerance-clinical',
                            code: allergy.clinicalStatus,
                        }],
                },
                category: [allergy.category.toLowerCase()],
                criticality: allergy.criticality.toLowerCase(),
                code: {
                    coding: [{
                            system: allergy.codeSystem,
                            code: allergy.code,
                            display: allergy.display,
                        }],
                },
                patient: { reference: `Patient/${allergy.patientId}` },
                recordedDate: allergy.recordedDate.toISOString(),
                reaction: allergy.reactions,
            },
        };
    }
    mapMedicationToFhir(medication) {
        var _a, _b;
        return {
            fullUrl: `MedicationStatement/${medication.id}`,
            resource: {
                resourceType: 'MedicationStatement',
                id: medication.id,
                status: medication.status.toLowerCase(),
                medicationCodeableConcept: {
                    coding: [{
                            code: medication.medicationCode,
                            display: medication.medicationDisplay,
                        }],
                },
                subject: { reference: `Patient/${medication.patientId}` },
                effectivePeriod: {
                    start: (_a = medication.effectiveStart) === null || _a === void 0 ? void 0 : _a.toISOString(),
                    end: (_b = medication.effectiveEnd) === null || _b === void 0 ? void 0 : _b.toISOString(),
                },
                dosage: medication.dosage ? [medication.dosage] : [],
            },
        };
    }
    mapImmunizationToFhir(immunization) {
        var _a;
        return {
            fullUrl: `Immunization/${immunization.id}`,
            resource: {
                resourceType: 'Immunization',
                id: immunization.id,
                status: immunization.status.toLowerCase(),
                vaccineCode: {
                    coding: [{
                            code: immunization.vaccineCode,
                            display: immunization.vaccineDisplay,
                        }],
                },
                patient: { reference: `Patient/${immunization.patientId}` },
                occurrenceDateTime: immunization.occurrenceDate.toISOString(),
                lotNumber: immunization.lotNumber,
                expirationDate: (_a = immunization.expirationDate) === null || _a === void 0 ? void 0 : _a.toISOString().split('T')[0],
            },
        };
    }
    mapObservationToFhir(observation) {
        return {
            fullUrl: `Observation/${observation.id}`,
            resource: {
                resourceType: 'Observation',
                id: observation.id,
                status: observation.status.toLowerCase(),
                category: observation.category ? [{
                        coding: [{ code: observation.category }],
                    }] : [],
                code: {
                    coding: [{
                            system: observation.codeSystem,
                            code: observation.code,
                            display: observation.display,
                        }],
                },
                subject: { reference: `Patient/${observation.patientId}` },
                effectiveDateTime: observation.effectiveDateTime.toISOString(),
                valueQuantity: observation.valueQuantity ? {
                    value: observation.valueQuantity,
                    unit: observation.valueUnit,
                } : undefined,
                valueString: observation.valueString,
            },
        };
    }
    async checkAccess(userId, tenantId, resourceType, resourceId, action) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user || user.tenantId !== tenantId) {
            throw new common_1.ForbiddenException('Access denied: tenant mismatch');
        }
        if (user.role === 'SUPER_ADMIN' || user.role === 'ADMIN_CLINICA') {
            return true;
        }
        const policy = await this.prisma.accessPolicy.findFirst({
            where: {
                userId,
                resourceType,
                OR: [
                    { resourceId: resourceId },
                    { resourceId: null },
                ],
                action,
                OR: [
                    { expiresAt: null },
                    { expiresAt: { gte: new Date() } },
                ],
            },
        });
        if (policy) {
            return true;
        }
        if (resourceType === 'Patient') {
            if (user.role === 'RECEPCAO' && action === 'READ') {
                return true;
            }
            if (['MEDICO', 'DENTISTA', 'PSICOLOGO', 'ENFERMEIRO'].includes(user.role)) {
                const hasEncounter = await this.prisma.encounter.findFirst({
                    where: {
                        patientId: resourceId,
                        practitionerId: userId,
                        status: { in: ['IN_PROGRESS', 'FINISHED'] },
                    },
                });
                if (hasEncounter) {
                    return true;
                }
            }
        }
        throw new common_1.ForbiddenException('Access denied: insufficient permissions');
    }
    async breakTheGlass(userId, tenantId, resourceType, resourceId, justification) {
        if (!justification || justification.length < 20) {
            throw new common_1.ForbiddenException('Justification required for emergency access (min 20 chars)');
        }
        await this.audit.log({
            tenantId,
            userId,
            action: 'BREAK_THE_GLASS',
            resourceType,
            resourceId,
            description: 'Acesso de emergência (break-the-glass)',
            accessPurpose: 'emergency',
            justification,
        });
        await this.prisma.accessPolicy.create({
            data: {
                userId,
                resourceType,
                resourceId,
                action: 'read',
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
            },
        });
        return { granted: true, expiresIn: '24 hours' };
    }
    generateSummary(soapData) {
        const parts = [];
        if (soapData.subjective)
            parts.push(`S: ${soapData.subjective.substring(0, 100)}`);
        if (soapData.assessment)
            parts.push(`A: ${soapData.assessment.substring(0, 100)}`);
        return parts.join(' | ');
    }
};
exports.EhrService = EhrService;
exports.EhrService = EhrService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_service_1.AuditService])
], EhrService);
//# sourceMappingURL=ehr.service.js.map