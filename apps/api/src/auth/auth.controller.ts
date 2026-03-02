import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './guards/auth/auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    signIn(@Body() signInDto: Record<string, any>) {
        console.log('AuthController: Recebida requisição de login', signInDto);
        return this.authService.signIn(signInDto.email, signInDto.password);
    }

    @Post('register')
    register(@Body() registerDto: Record<string, any>) {
        return this.authService.register(registerDto as any);
    }

    @UseGuards(AuthGuard)
    @Get('me')
    getProfile(@Request() req: any) {
        return this.authService.getProfile(req.user.sub);
    }

    @Get('test')
    test() {
        console.log('Test Endpoint Hit');
        return { message: 'Auth Controller Workin' };
    }

    @Get('test-service')
    testService() {
        return this.authService.test();
    }

    @Get('test-prisma')
    testPrisma() {
        return this.authService.testPrisma();
    }

    @Get('test-bcrypt')
    testBcrypt() {
        return this.authService.testBcrypt();
    }
}
