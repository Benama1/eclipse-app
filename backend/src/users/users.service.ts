import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './user.entity';
import { CreateUserDto, UpdateUserDto } from './users.dto';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  findAll() {
    return this.repo.find({ order: { createdAt: 'ASC' } });
  }

  findById(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  findByEmailWithPassword(email: string) {
    return this.repo
      .createQueryBuilder('u')
      .addSelect('u.passwordHash')
      .where('u.email = :email', { email })
      .getOne();
  }

  async create(dto: CreateUserDto) {
    const existing = await this.repo.findOne({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Un utilisateur avec cet email existe déjà.');
    const passwordHash = await bcrypt.hash(dto.password || 'eclipse2026', 10);
    const user = this.repo.create({
      firstname: dto.firstname,
      lastname: dto.lastname,
      email: dto.email,
      role: dto.role,
      access: dto.role === 'collab' ? dto.access ?? 'both' : null,
      lang: dto.lang || 'fr',
      currency: dto.currency || 'EUR',
      passwordHash,
    });
    return this.repo.save(user);
  }

  async update(id: string, dto: UpdateUserDto) {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Utilisateur introuvable');
    Object.assign(user, dto);
    return this.repo.save(user);
  }

  async remove(id: string) {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Utilisateur introuvable');
    await this.repo.remove(user);
    return { deleted: true };
  }
}
