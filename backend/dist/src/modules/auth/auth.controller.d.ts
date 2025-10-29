import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
export declare class AuthController {
    private readonly auth;
    constructor(auth: AuthService);
    register(body: RegisterDto): Promise<{
        accessToken: any;
        refreshToken: any;
    }>;
    login(body: LoginDto): Promise<{
        accessToken: any;
        refreshToken: any;
    }>;
}
