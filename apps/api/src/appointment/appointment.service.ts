import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AppointmentService {
  constructor(private prisma: PrismaService) {}

  private async validateScheduleFailsafes(
    professionalId: string, 
    dateString: string, 
    durationMinutes: number = 30,
    ignoreAppointmentId?: string
  ) {
    const appointmentStart = new Date(dateString);
    const now = new Date();

    // Failsafe 1: Prevenir agendamento no passado (com uma margem de tolerância de 5 minutos p/ latência)
    if (appointmentStart.getTime() < now.getTime() - 5 * 60000) {
      throw new BadRequestException('Failsafe: Não é possível retroagir agendamentos no tempo.');
    }

    // Failsafe 2: Regras de horário comercial (08:00 às 18:00)
    const hour = appointmentStart.getHours();
    if (hour < 8 || hour >= 18) {
      throw new BadRequestException('Failsafe: Horário fora do expediente comercial da clínica (08:00 às 18:00).');
    }

    // Failsafe 3: Prevenção de Overbooking (Choque de Horários)
    const startOfDay = new Date(appointmentStart);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(appointmentStart);
    endOfDay.setHours(23, 59, 59, 999);

    const dayAppointments = await this.prisma.appointment.findMany({
      where: {
        professionalId,
        date: { gte: startOfDay, lte: endOfDay },
        status: { notIn: ['CANCELLED'] },
        ...(ignoreAppointmentId ? { id: { not: ignoreAppointmentId } } : {})
      }
    });

    const newStart = appointmentStart.getTime();
    const newEnd = newStart + durationMinutes * 60000;

    for (const apt of dayAppointments) {
      const aptStart = new Date(apt.date).getTime();
      const aptDuration = apt.duration || 30;
      const aptEnd = aptStart + aptDuration * 60000;

      if (newStart < aptEnd && newEnd > aptStart) {
        throw new BadRequestException('Failsafe: Conflito de agenda. O profissional já possui um atendimento neste horário.');
      }
    }
  }

  async create(createAppointmentDto: CreateAppointmentDto) {
    await this.validateScheduleFailsafes(
      createAppointmentDto.professionalId,
      createAppointmentDto.date,
      createAppointmentDto.duration
    );

    return this.prisma.appointment.create({
      data: createAppointmentDto,
    });
  }

  findAll() {
    return this.prisma.appointment.findMany({
      orderBy: { date: 'asc' },
    });
  }

  async findOne(id: string) {
    const appointment = await this.prisma.appointment.findUnique({ where: { id } });
    if (!appointment) throw new NotFoundException('Appointment not found');
    return appointment;
  }

  async update(id: string, updateAppointmentDto: UpdateAppointmentDto) {
    if (updateAppointmentDto.date || updateAppointmentDto.duration || updateAppointmentDto.professionalId) {
      const existing = await this.findOne(id);
      
      const professionalId = updateAppointmentDto.professionalId || existing.professionalId;
      const dateString = updateAppointmentDto.date || existing.date.toISOString();
      const duration = updateAppointmentDto.duration || existing.duration || 30;

      await this.validateScheduleFailsafes(professionalId, dateString, duration, id);
    }

    return this.prisma.appointment.update({
      where: { id },
      data: updateAppointmentDto,
    });
  }

  remove(id: string) {
    return this.prisma.appointment.delete({ where: { id } });
  }
}
