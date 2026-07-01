import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const user = await this.userService.create(registerDto);
    return this.generateToken(user);
  }

  async login(loginDto: LoginDto) {
    const user = await this.userService.findByEmailOrPhone(loginDto.identifier);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    // In a real app, compare password (hashed). For MVP we'll just check plain text (use bcrypt later).
    if (user.password !== loginDto.password) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.generateToken(user);
  }

  private generateToken(user: any) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      is_seller: user.is_seller,
    };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        is_seller: user.is_seller,
        role: user.role,
      },
    };
  }
}