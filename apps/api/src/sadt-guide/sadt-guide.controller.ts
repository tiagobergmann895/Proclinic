import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { SadtGuideService } from './sadt-guide.service';
import { CreateSadtGuideDto } from './dto/create-sadt-guide.dto';
import { UpdateSadtGuideDto } from './dto/update-sadt-guide.dto';

@Controller('sadt-guide')
export class SadtGuideController {
  constructor(private readonly sadtGuideService: SadtGuideService) {}

  @Post()
  create(@Body() dto: CreateSadtGuideDto) {
    return this.sadtGuideService.create(dto);
  }

  @Get()
  findAll(@Query('patientId') patientId?: string) {
    return this.sadtGuideService.findAll(patientId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sadtGuideService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateSadtGuideDto) {
    return this.sadtGuideService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sadtGuideService.remove(id);
  }
}
