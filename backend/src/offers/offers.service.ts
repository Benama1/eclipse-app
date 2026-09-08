import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Offer } from './offer.entity';
import { CreateOfferDto, UpdateOfferDto } from './offers.dto';

@Injectable()
export class OffersService {
  constructor(@InjectRepository(Offer) private repo: Repository<Offer>) {}
  findAll() { return this.repo.find({ order: { createdAt: 'DESC' } }); }
  create(dto: CreateOfferDto) {
    return this.repo.save(this.repo.create({ ...dto, date: new Date().toISOString().slice(0, 10), status: 'active' }));
  }
  async update(id: string, dto: UpdateOfferDto) {
    const o = await this.repo.findOne({ where: { id } });
    if (!o) throw new NotFoundException('Offre introuvable');
    Object.assign(o, dto);
    return this.repo.save(o);
  }
  async remove(id: string) {
    const o = await this.repo.findOne({ where: { id } });
    if (!o) throw new NotFoundException('Offre introuvable');
    await this.repo.remove(o);
    return { deleted: true };
  }
}
