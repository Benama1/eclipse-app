import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './auth.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  /**
   * Connexion réelle par email + mot de passe (JWT).
   * Comptes de démonstration seedés (voir src/seed/seed.ts) :
   *   camille.dubois@eclipse-ce.fr / eclipse2026   → Admin CE
   *   yanis.haddad@eclipse-ce.fr   / eclipse2026   → Collaborateur CE
   *   lina.moreau@eclipse-ce.fr    / eclipse2026   → Salarié
   */
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto.email, dto.password);
  }
}
