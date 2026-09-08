import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DocumentEntity } from './document.entity';
import { DocumentsStorage } from './documents.storage';

function detectType(originalname: string, mimeType: string): string {
  const ext = (originalname.split('.').pop() || '').toLowerCase();
  if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(ext) || mimeType.startsWith('image/')) return 'image';
  if (ext === 'pdf') return 'pdf';
  if (['doc', 'docx'].includes(ext)) return 'word';
  if (['xls', 'xlsx'].includes(ext)) return 'excel';
  if (['ppt', 'pptx'].includes(ext)) return 'powerpoint';
  if (ext === 'csv') return 'csv';
  if (ext === 'zip') return 'zip';
  if (ext === 'txt') return 'text';
  return 'other';
}
function fmtSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(DocumentEntity) private repo: Repository<DocumentEntity>,
    private storage: DocumentsStorage,
  ) {}

  findAll() { return this.repo.find({ order: { createdAt: 'DESC' } }); }

  async upload(file: Express.Multer.File, category: string) {
    const storageKey = await this.storage.save(file.originalname, file.buffer);
    const doc = this.repo.create({
      name: file.originalname,
      type: detectType(file.originalname, file.mimetype),
      category: category || 'Général',
      date: new Date().toISOString().slice(0, 10),
      sizeLabel: fmtSize(file.size),
      mimeType: file.mimetype,
      storageKey,
    });
    return this.repo.save(doc);
  }

  async getFile(id: string) {
    const doc = await this.repo.findOne({ where: { id } });
    if (!doc || !doc.storageKey) throw new NotFoundException('Fichier introuvable');
    const buffer = await this.storage.read(doc.storageKey);
    return { doc, buffer };
  }

  async remove(id: string) {
    const doc = await this.repo.findOne({ where: { id } });
    if (!doc) throw new NotFoundException('Document introuvable');
    if (doc.storageKey) await this.storage.delete(doc.storageKey);
    await this.repo.remove(doc);
    return { deleted: true };
  }
}
