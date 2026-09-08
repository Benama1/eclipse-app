import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import { join } from 'path';

/**
 * Abstraction de stockage des fichiers.
 * Aujourd'hui : disque local (DOCUMENTS_LOCAL_PATH). Demain : remplacer par
 * un driver S3 (ou équivalent) sans changer DocumentsService ni le contrôleur.
 */
@Injectable()
export class DocumentsStorage {
  private root = process.env.DOCUMENTS_LOCAL_PATH || './uploads';

  async save(filename: string, buffer: Buffer): Promise<string> {
    await fs.mkdir(this.root, { recursive: true });
    const key = `${Date.now()}-${filename}`.replace(/\s+/g, '_');
    await fs.writeFile(join(this.root, key), buffer);
    return key;
  }

  async read(key: string): Promise<Buffer> {
    return fs.readFile(join(this.root, key));
  }

  async delete(key: string): Promise<void> {
    try { await fs.unlink(join(this.root, key)); } catch { /* fichier déjà absent */ }
  }
}
