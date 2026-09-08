import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('documents')
export class DocumentEntity {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() name: string;
  @Column() type: string; // pdf | word | excel | powerpoint | image | text | csv | zip | other
  @Column({ nullable: true }) category: string;
  @Column({ type: 'date' }) date: string;
  @Column({ nullable: true }) sizeLabel: string;
  @Column({ nullable: true }) mimeType: string;
  /** Chemin relatif sur le disque du serveur (driver 'local') ou clé objet (driver futur 'S3'). */
  @Column({ nullable: true }) storageKey: string;
  @CreateDateColumn() createdAt: Date;
}
