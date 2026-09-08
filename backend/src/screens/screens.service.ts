import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomBytes } from 'crypto';
import { Screen } from './screen.entity';
import { CreateScreenDto, UpdateScreenDto } from './screens.dto';

@Injectable()
export class ScreensService {
  constructor(@InjectRepository(Screen) private repo: Repository<Screen>) {}

  findAll() { return this.repo.find({ order: { createdAt: 'DESC' } }); }

  create(dto: CreateScreenDto) {
    return this.repo.save(this.repo.create({
      ...dto, status: 'active', content: 'Dashboard', lastSeen: new Date(),
      pairingToken: randomBytes(8).toString('hex'),
    }));
  }

  async update(id: string, dto: UpdateScreenDto) {
    const s = await this.repo.findOne({ where: { id } });
    if (!s) throw new NotFoundException('Écran introuvable');
    Object.assign(s, dto);
    return this.repo.save(s);
  }

  async remove(id: string) {
    const s = await this.repo.findOne({ where: { id } });
    if (!s) throw new NotFoundException('Écran introuvable');
    await this.repo.remove(s);
    return { deleted: true };
  }

  /** Appelé par l'app Android TV lors de l'appairage par QR code. */
  async pair(pairingToken: string) {
    const s = await this.repo.findOne({ where: { pairingToken } });
    if (!s) throw new NotFoundException('Jeton invalide');
    s.status = 'active';
    s.lastSeen = new Date();
    return this.repo.save(s);
  }
}
