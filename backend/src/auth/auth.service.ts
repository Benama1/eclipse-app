import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private users: UsersService, private jwt: JwtService) {}

  async login(email: string, password: string) {
    const user = await this.users.findByEmailWithPassword(email);
    if (!user) throw new UnauthorizedException('Identifiants invalides');
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Identifiants invalides');

    const payload = {
      sub: user.id, email: user.email, role: user.role, access: user.access,
      firstname: user.firstname, lastname: user.lastname,
    };
    return {
      accessToken: this.jwt.sign(payload),
      user: { id: user.id, firstname: user.firstname, lastname: user.lastname, email: user.email,
        role: user.role, access: user.access, lang: user.lang, currency: user.currency },
    };
  }
}
