import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Communication } from './communication.entity';
import { CreateCommunicationDto, UpdateCommunicationDto } from './communications.dto';

const PRIORITY_ORDER: Record<string, number> = { urgent: 0, important: 1, normal: 2, info: 3 };

@Injectable()
export class CommunicationsService {
  constructor(@InjectRepository(Communication) private repo: Repository<Communication>) {}

  async findAll() {
    const list = await this.repo.find();
    // Informations prioritaires en premier, puis les plus récentes
    return list.sort((a, b) => {
      const pa = PRIORITY_ORDER[a.priority] ?? 2, pb = PRIORITY_ORDER[b.priority] ?? 2;
      if (pa !== pb) return pa - pb;
      return a.date < b.date ? 1 : -1;
    });
  }

  create(dto: CreateCommunicationDto, authorName: string) {
    return this.repo.save(this.repo.create({
      ...dto, author: authorName, date: new Date().toISOString().slice(0, 10),
      category: dto.category || 'Communication', priority: dto.priority || 'normal', status: 'published',
    }));
  }

  async update(id: string, dto: UpdateCommunicationDto) {
    const c = await this.repo.findOne({ where: { id } });
    if (!c) throw new NotFoundException('Information introuvable');
    Object.assign(c, dto);
    return this.repo.save(c);
  }

  async remove(id: string) {
    const c = await this.repo.findOne({ where: { id } });
    if (!c) throw new NotFoundException('Information introuvable');
    await this.repo.remove(c);
    return { deleted: true };
  }
}
