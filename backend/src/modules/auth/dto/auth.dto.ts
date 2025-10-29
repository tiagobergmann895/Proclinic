import { IsEmail, IsString, MinLength, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class RegisterDto {
  @ApiProperty({ example: 'João Silva' })
  @IsString()
  @MinLength(2)
  name: string = '';

  @ApiProperty({ example: 'joao@clinica.com' })
  @IsEmail()
  email: string = '';

  @ApiProperty({ example: 'senha123', minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string = '';

  @ApiProperty({ enum: Role, example: Role.recepcao })
  @IsEnum(Role)
  role: Role = Role.recepcao;
}

export class LoginDto {
  @ApiProperty({ example: 'joao@clinica.com' })
  @IsEmail()
  email: string = '';

  @ApiProperty({ example: 'senha123' })
  @IsString()
  password: string = '';
}
