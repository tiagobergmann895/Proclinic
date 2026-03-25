import { PartialType } from '@nestjs/mapped-types';
import { CreateSadtGuideDto } from './create-sadt-guide.dto';
import { IsString, IsOptional } from 'class-validator';

export class UpdateSadtGuideDto extends PartialType(CreateSadtGuideDto) {
  @IsString()
  @IsOptional()
  status?: string;
}
