import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Query,
  UseGuards, 
  Request,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiConsumes } from '@nestjs/swagger';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { EhrService } from './ehr.service';
import {
  CreateSoapNoteDto,
  SignNoteDto,
  RecordVitalSignsDto,
  CreatePrescriptionDto,
  CreateAllergyDto,
  CreateConditionDto,
  CreateImmunizationDto,
  CreateMedicationStatementDto,
  TimelineQueryDto,
  UploadDocumentDto,
  BreakTheGlassDto,
  CreateEncounterDto,
} from './dto/ehr.dto';

@ApiTags('EHR - Prontuário Eletrônico')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller('ehr')
export class EhrController {
  constructor(private readonly service: EhrService) {}

  // ============================================================================
  // TIMELINE
  // ============================================================================

  @Get('patients/:patientId/timeline')
  @Roles('DOCTOR', 'DENTISTA', 'PSICOLOGO', 'ENFERMEIRO', 'ADMIN_CLINICA', 'AUDITOR')
  @ApiOperation({ summary: 'Timeline completa do paciente' })
  getTimeline(
    @Param('patientId') patientId: string,
    @Query() query: TimelineQueryDto,
    @Request() req: any,
  ) {
    return this.service.getPatientTimeline(
      patientId,
      req.user.userId,
      req.user.tenantId,
      {
        from: query.from ? new Date(query.from) : undefined,
        to: query.to ? new Date(query.to) : undefined,
        types: query.types,
        page: query.page,
        pageSize: query.pageSize,
      }
    );
  }

  // ============================================================================
  // SOAP NOTES
  // ============================================================================

  @Post('notes/soap')
  @Roles('DOCTOR', 'DENTISTA', 'PSICOLOGO', 'ENFERMEIRO')
  @ApiOperation({ summary: 'Criar evolução SOAP' })
  createSoapNote(@Body() dto: CreateSoapNoteDto, @Request() req: any) {
    return this.service.createSoapNote(dto, req.user.userId, req.user.tenantId);
  }

  @Post('notes/sign')
  @Roles('DOCTOR', 'DENTISTA', 'PSICOLOGO', 'ENFERMEIRO')
  @ApiOperation({ summary: 'Assinar nota clínica' })
  signNote(@Body() dto: SignNoteDto, @Request() req: any) {
    return this.service.signClinicalNote(dto.noteId, req.user.userId, req.user.tenantId);
  }

  // ============================================================================
  // VITAL SIGNS
  // ============================================================================

  @Post('observations/vital-signs')
  @Roles('DOCTOR', 'DENTISTA', 'PSICOLOGO', 'ENFERMEIRO', 'RECEPCAO')
  @ApiOperation({ summary: 'Registrar sinais vitais' })
  recordVitalSigns(@Body() dto: RecordVitalSignsDto, @Request() req: any) {
    return this.service.recordVitalSigns(dto, req.user.userId, req.user.tenantId);
  }

  @Get('patients/:patientId/vital-signs')
  @Roles('DOCTOR', 'DENTISTA', 'PSICOLOGO', 'ENFERMEIRO', 'ADMIN_CLINICA')
  @ApiOperation({ summary: 'Histórico de sinais vitais' })
  getVitalSigns(
    @Param('patientId') patientId: string,
    @Query('code') code?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Request() req: any
  ) {
    // Implementar busca filtrada de observations
    return { message: 'Get vital signs - to implement' };
  }

  // ============================================================================
  // PRESCRIPTIONS
  // ============================================================================

  @Post('prescriptions')
  @Roles('DOCTOR', 'DENTISTA')
  @ApiOperation({ summary: 'Criar prescrição' })
  createPrescription(@Body() dto: CreatePrescriptionDto, @Request() req: any) {
    return this.service.createPrescription(dto, req.user.userId, req.user.tenantId);
  }

  @Post('prescriptions/:id/sign')
  @Roles('DOCTOR', 'DENTISTA')
  @ApiOperation({ summary: 'Assinar prescrição' })
  signPrescription(@Param('id') id: string, @Request() req: any) {
    return this.service.signPrescription(id, req.user.userId, req.user.tenantId);
  }

  // ============================================================================
  // ALLERGIES
  // ============================================================================

  @Post('allergies')
  @Roles('DOCTOR', 'DENTISTA', 'ENFERMEIRO')
  @ApiOperation({ summary: 'Registrar alergia' })
  createAllergy(@Body() dto: CreateAllergyDto, @Request() req: any) {
    // Implementar
    return { message: 'Create allergy - to implement' };
  }

  @Get('patients/:patientId/allergies')
  @Roles('DOCTOR', 'DENTISTA', 'PSICOLOGO', 'ENFERMEIRO', 'RECEPCAO')
  @ApiOperation({ summary: 'Listar alergias do paciente' })
  getAllergies(@Param('patientId') patientId: string, @Request() req: any) {
    // Implementar
    return { message: 'Get allergies - to implement' };
  }

  // ============================================================================
  // CONDITIONS
  // ============================================================================

  @Post('conditions')
  @Roles('DOCTOR', 'DENTISTA')
  @ApiOperation({ summary: 'Registrar diagnóstico/problema' })
  createCondition(@Body() dto: CreateConditionDto, @Request() req: any) {
    // Implementar
    return { message: 'Create condition - to implement' };
  }

  @Get('patients/:patientId/conditions')
  @Roles('DOCTOR', 'DENTISTA', 'PSICOLOGO', 'ENFERMEIRO')
  @ApiOperation({ summary: 'Listar problemas ativos' })
  getConditions(
    @Param('patientId') patientId: string,
    @Query('status') status?: string,
    @Request() req: any
  ) {
    // Implementar
    return { message: 'Get conditions - to implement' };
  }

  // ============================================================================
  // IMMUNIZATIONS
  // ============================================================================

  @Post('immunizations')
  @Roles('DOCTOR', 'ENFERMEIRO')
  @ApiOperation({ summary: 'Registrar vacinação' })
  createImmunization(@Body() dto: CreateImmunizationDto, @Request() req: any) {
    // Implementar
    return { message: 'Create immunization - to implement' };
  }

  @Get('patients/:patientId/immunizations')
  @Roles('DOCTOR', 'DENTISTA', 'PSICOLOGO', 'ENFERMEIRO', 'RECEPCAO')
  @ApiOperation({ summary: 'Cartão de vacinas' })
  getImmunizations(@Param('patientId') patientId: string, @Request() req: any) {
    // Implementar
    return { message: 'Get immunizations - to implement' };
  }

  // ============================================================================
  // DOCUMENTS
  // ============================================================================

  @Post('documents/upload')
  @Roles('DOCTOR', 'DENTISTA', 'PSICOLOGO', 'ENFERMEIRO', 'RECEPCAO')
  @ApiOperation({ summary: 'Upload de documento' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  uploadDocument(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UploadDocumentDto,
    @Request() req: any,
  ) {
    return this.service.uploadDocument(
      {
        filename: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        buffer: file.buffer,
      },
      dto,
      req.user.userId,
      req.user.tenantId,
    );
  }

  @Get('documents/:id/download')
  @Roles('DOCTOR', 'DENTISTA', 'PSICOLOGO', 'ENFERMEIRO', 'RECEPCAO', 'ADMIN_CLINICA')
  @ApiOperation({ summary: 'Download de documento (presigned URL)' })
  downloadDocument(@Param('id') id: string, @Request() req: any) {
    return this.service.getPresignedDownloadUrl(id, req.user.userId, req.user.tenantId);
  }

  // ============================================================================
  // FHIR EXPORT
  // ============================================================================

  @Get('patients/:patientId/export/fhir')
  @Roles('DOCTOR', 'ADMIN_CLINICA', 'AUDITOR')
  @ApiOperation({ summary: 'Exportar prontuário em FHIR Bundle' })
  exportFhir(@Param('patientId') patientId: string, @Request() req: any) {
    return this.service.exportPatientBundle(patientId, req.user.userId, req.user.tenantId);
  }

  // ============================================================================
  // ENCOUNTERS
  // ============================================================================

  @Post('encounters')
  @Roles('DOCTOR', 'DENTISTA', 'PSICOLOGO', 'ENFERMEIRO', 'RECEPCAO')
  @ApiOperation({ summary: 'Criar consulta/atendimento' })
  createEncounter(@Body() dto: CreateEncounterDto, @Request() req: any) {
    // Implementar
    return { message: 'Create encounter - to implement' };
  }

  @Post('encounters/:id/start')
  @Roles('DOCTOR', 'DENTISTA', 'PSICOLOGO', 'ENFERMEIRO')
  @ApiOperation({ summary: 'Iniciar atendimento' })
  startEncounter(@Param('id') id: string, @Request() req: any) {
    // Implementar
    return { message: 'Start encounter - to implement' };
  }

  @Post('encounters/:id/finish')
  @Roles('DOCTOR', 'DENTISTA', 'PSICOLOGO', 'ENFERMEIRO')
  @ApiOperation({ summary: 'Finalizar atendimento' })
  finishEncounter(@Param('id') id: string, @Request() req: any) {
    // Implementar
    return { message: 'Finish encounter - to implement' };
  }

  // ============================================================================
  // BREAK-THE-GLASS (Acesso de Emergência)
  // ============================================================================

  @Post('break-the-glass')
  @Roles('DOCTOR', 'ENFERMEIRO')
  @ApiOperation({ 
    summary: 'Acesso de emergência com justificativa',
    description: 'Permite acesso temporário a prontuários restritos em situações de emergência. Requer justificativa detalhada e gera auditoria reforçada.'
  })
  breakTheGlass(@Body() dto: BreakTheGlassDto, @Request() req: any) {
    return this.service.breakTheGlass(
      req.user.userId,
      req.user.tenantId,
      dto.resourceType,
      dto.resourceId,
      dto.justification,
    );
  }
}




