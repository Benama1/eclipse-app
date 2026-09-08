import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Meeting } from './meeting.entity';
import { CreateMeetingDto, UpdateMeetingDto } from './meetings.dto';

@Injectable()
export class MeetingsService {
  constructor(@InjectRepository(Meeting) private repo: Repository<Meeting>) {}

  findAll() { return this.repo.find({ order: { date: 'DESC' } }); }

  async create(dto: CreateMeetingDto) {
    return this.repo.save(this.repo.create({ ...dto, status: 'upcoming' }));
  }

  async update(id: string, dto: UpdateMeetingDto) {
    const m = await this.repo.findOne({ where: { id } });
    if (!m) throw new NotFoundException('Réunion introuvable');
    Object.assign(m, dto);
    return this.repo.save(m);
  }

  async remove(id: string) {
    const m = await this.repo.findOne({ where: { id } });
    if (!m) throw new NotFoundException('Réunion introuvable');
    await this.repo.remove(m);
    return { deleted: true };
  }
}
