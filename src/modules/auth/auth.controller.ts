import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('register')
  async register(@Body() body: RegisterDto) {
    return this.auth.register(body.name, body.email, body.password, body.role);
  }

  @Post('login')
  async login(@Body() body: LoginDto) {
    return this.auth.login(body.email, body.password);
  }
}



