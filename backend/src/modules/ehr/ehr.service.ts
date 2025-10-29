import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { AuditService } from './audit.service';
import * as crypto from 'crypto';

@Injectable()
export class EhrService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  // ============================================================================
  // TIMELINE DO PACIENTE
  // ============================================================================
  
  async getPatientTimeline(
    patientId: string,
    userId: string,
    tenantId: string,
    options: {
      from?: Date;
      to?: Date;
      types?: string[]; // encounters, notes, observations, prescriptions, etc.
      page?: number;
      pageSize?: number;
    }
  ) {
    // Verificar acesso
    await this.checkAccess(userId, tenantId, 'Patient', patientId, 'READ');
    
    // Registrar auditoria
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

    // Buscar eventos da timeline
    const timeline = [];

    // Encounters
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

    // Clinical Notes
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

    // Observations
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

    // Prescriptions
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

    // Diagnostic Reports
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

    // Ordenar por data
    timeline.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return {
      timeline: timeline.slice(0, pageSize),
      total: timeline.length,
      page,
      pageSize,
    };
  }

  // ============================================================================
  // CRIAÇÃO DE EVOLUÇÃO SOAP
  // ============================================================================
  
  async createSoapNote(
    data: {
      patientId: string;
      encounterId?: string;
      subjective: string;
      objective: string;
      assessment: string;
      plan: string;
      title?: string;
    },
    userId: string,
    tenantId: string,
  ) {
    // Verificar acesso
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

    // Auditoria
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

  async signClinicalNote(noteId: string, userId: string, tenantId: string) {
    const note = await this.prisma.clinicalNote.findUnique({
      where: { id: noteId },
    });

    if (!note || note.tenantId !== tenantId) {
      throw new NotFoundException('Note not found');
    }

    if (note.authorId !== userId) {
      throw new ForbiddenException('Only the author can sign the note');
    }

    // Gerar hash da nota
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

    // Auditoria
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

  // ============================================================================
  // REGISTRO DE SINAIS VITAIS
  // ============================================================================
  
  async recordVitalSigns(
    data: {
      patientId: string;
      encounterId?: string;
      vitalSigns: Array<{
        code: string;        // LOINC code
        display: string;
        value: number;
        unit: string;
      }>;
    },
    userId: string,
    tenantId: string,
  ) {
    await this.checkAccess(userId, tenantId, 'Patient', data.patientId, 'WRITE');

    const observations = await Promise.all(
      data.vitalSigns.map(vs =>
        this.prisma.observation.create({
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
        })
      )
    );

    // Auditoria
    await this.audit.log({
      tenantId,
      userId,
      action: 'CREATE',
      resourceType: 'Observation',
      description: `Registrou ${observations.length} sinais vitais`,
    });

    return observations;
  }

  private interpretVitalSign(code: string, value: number): string {
    // Interpretação básica (expandir conforme necessário)
    const ranges: Record<string, { low: number; high: number }> = {
      '8310-5': { low: 36.1, high: 37.2 },  // Temperatura (°C)
      '8867-4': { low: 60, high: 100 },     // Freq. cardíaca (bpm)
      '9279-1': { low: 12, high: 20 },      // Freq. respiratória (rpm)
      '8480-6': { low: 90, high: 120 },     // PA sistólica (mmHg)
      '8462-4': { low: 60, high: 80 },      // PA diastólica (mmHg)
    };

    const range = ranges[code];
    if (!range) return 'normal';

    if (value < range.low) return 'low';
    if (value > range.high) return 'high';
    return 'normal';
  }

  // ============================================================================
  // PRESCRIÇÃO COM VERIFICAÇÃO DE ALERGIAS
  // ============================================================================
  
  async createPrescription(
    data: {
      patientId: string;
      encounterId?: string;
      items: Array<{
        medication: string;
        dosage: string;
        duration: string;
        notes?: string;
      }>;
      notes?: string;
    },
    userId: string,
    tenantId: string,
  ) {
    await this.checkAccess(userId, tenantId, 'Patient', data.patientId, 'WRITE');

    // Verificar alergias do paciente
    const allergies = await this.prisma.allergyIntolerance.findMany({
      where: {
        patientId: data.patientId,
        clinicalStatus: 'active',
        category: 'MEDICATION',
      },
    });

    // Verificar interações (simplificado - expandir com base de dados de medicamentos)
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

    // Se houver alergias críticas, lançar exceção
    const criticalAllergies = warnings.filter(w => w.severity === 'HIGH');
    if (criticalAllergies.length > 0) {
      throw new ForbiddenException({
        message: 'Prescrição bloqueada por alergia crítica',
        allergies: criticalAllergies,
      });
    }

    // Criar prescrição
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

    // Auditoria
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

  async signPrescription(prescriptionId: string, userId: string, tenantId: string) {
    const prescription = await this.prisma.prescription.findUnique({
      where: { id: prescriptionId },
    });

    if (!prescription || prescription.tenantId !== tenantId) {
      throw new NotFoundException('Prescription not found');
    }

    if (prescription.prescriberId !== userId) {
      throw new ForbiddenException('Only the prescriber can sign');
    }

    // Gerar PDF (implementar com lib como pdfkit ou puppeteer)
    // const pdfUrl = await this.generatePrescriptionPdf(prescription);

    const updated = await this.prisma.prescription.update({
      where: { id: prescriptionId },
      data: {
        status: 'ACTIVE',
        signedAt: new Date(),
        // pdfUrl,
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

  // ============================================================================
  // UPLOAD DE DOCUMENTOS
  // ============================================================================
  
  async uploadDocument(
    file: {
      filename: string;
      mimetype: string;
      size: number;
      buffer: Buffer;
    },
    metadata: {
      patientId: string;
      encounterId?: string;
      type: string;
      title?: string;
      description?: string;
    },
    userId: string,
    tenantId: string,
  ) {
    await this.checkAccess(userId, tenantId, 'Patient', metadata.patientId, 'WRITE');

    // Upload para storage (S3, GCS, etc.) - implementar
    // const fileUrl = await this.uploadToStorage(file);
    const fileUrl = `storage://${tenantId}/${metadata.patientId}/${file.filename}`;

    // Calcular hash para integridade
    const fileHash = crypto.createHash('sha256').update(file.buffer).digest('hex');

    const document = await this.prisma.documentReference.create({
      data: {
        tenantId,
        patientId: metadata.patientId,
        encounterId: metadata.encounterId,
        type: metadata.type as any,
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

  async getPresignedDownloadUrl(documentId: string, userId: string, tenantId: string) {
    const document = await this.prisma.documentReference.findUnique({
      where: { id: documentId },
    });

    if (!document || document.tenantId !== tenantId) {
      throw new NotFoundException('Document not found');
    }

    await this.checkAccess(userId, tenantId, 'Patient', document.patientId, 'READ');

    // Auditoria de acesso a documento
    await this.audit.log({
      tenantId,
      userId,
      action: 'READ',
      resourceType: 'DocumentReference',
      resourceId: documentId,
      description: `Baixou documento: ${document.fileName}`,
    });

    // Gerar URL assinada (implementar com S3/GCS SDK)
    // const presignedUrl = await this.generatePresignedUrl(document.fileUrl);
    const presignedUrl = document.fileUrl + '?expires=3600';

    return { url: presignedUrl, expiresIn: 3600 };
  }

  // ============================================================================
  // EXPORTAÇÃO FHIR
  // ============================================================================
  
  async exportPatientBundle(patientId: string, userId: string, tenantId: string) {
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
      throw new NotFoundException('Patient not found');
    }

    // Converter para FHIR Bundle
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

    // Auditoria de exportação
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

  // ============================================================================
  // MAPEAMENTO FHIR R4
  // ============================================================================
  
  private mapPatientToFhir(patient: any) {
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
        gender: patient.gender?.toLowerCase(),
        birthDate: patient.birthDate?.toISOString().split('T')[0],
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

  private mapConditionToFhir(condition: any) {
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
        onsetDateTime: condition.onsetDateTime?.toISOString(),
        abatementDateTime: condition.abatementDateTime?.toISOString(),
        recordedDate: condition.recordedDate.toISOString(),
      },
    };
  }

  private mapAllergyToFhir(allergy: any) {
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

  private mapMedicationToFhir(medication: any) {
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
          start: medication.effectiveStart?.toISOString(),
          end: medication.effectiveEnd?.toISOString(),
        },
        dosage: medication.dosage ? [medication.dosage] : [],
      },
    };
  }

  private mapImmunizationToFhir(immunization: any) {
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
        expirationDate: immunization.expirationDate?.toISOString().split('T')[0],
      },
    };
  }

  private mapObservationToFhir(observation: any) {
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

  // ============================================================================
  // CONTROLE DE ACESSO E BREAK-THE-GLASS
  // ============================================================================
  
  private async checkAccess(
    userId: string,
    tenantId: string,
    resourceType: string,
    resourceId: string,
    action: string,
  ) {
    // 1. Verificar tenant
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.tenantId !== tenantId) {
      throw new ForbiddenException('Access denied: tenant mismatch');
    }

    // 2. RBAC: Admin e Auditor têm acesso a tudo
    if (user.role === 'SUPER_ADMIN' || user.role === 'ADMIN_CLINICA') {
      return true;
    }

    // 3. ABAC: Verificar políticas específicas
    const policy = await this.prisma.accessPolicy.findFirst({
      where: {
        userId,
        resourceType,
        OR: [
          { resourceId: resourceId },
          { resourceId: null }, // Política geral
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

    // 4. Regras de negócio por role
    if (resourceType === 'Patient') {
      // Recepção pode ler dados demográficos
      if (user.role === 'RECEPCAO' && action === 'READ') {
        return true;
      }
      
      // Profissionais de saúde podem ler/escrever se tiverem encounter
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

    throw new ForbiddenException('Access denied: insufficient permissions');
  }

  async breakTheGlass(
    userId: string,
    tenantId: string,
    resourceType: string,
    resourceId: string,
    justification: string,
  ) {
    if (!justification || justification.length < 20) {
      throw new ForbiddenException('Justification required for emergency access (min 20 chars)');
    }

    // Registrar acesso de emergência com auditoria reforçada
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

    // Notificar administradores (implementar)
    // await this.notifyAdmins(tenantId, userId, resourceId, justification);

    // Conceder acesso temporário (24 horas)
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

  // ============================================================================
  // UTILITÁRIOS
  // ============================================================================
  
  private generateSummary(soapData: any): string {
    const parts = [];
    if (soapData.subjective) parts.push(`S: ${soapData.subjective.substring(0, 100)}`);
    if (soapData.assessment) parts.push(`A: ${soapData.assessment.substring(0, 100)}`);
    return parts.join(' | ');
  }
}




