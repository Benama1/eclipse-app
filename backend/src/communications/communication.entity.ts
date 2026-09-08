import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('communications')
export class Communication {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() title: string;
  @Column({ type: 'text' }) content: string;
  @Column() author: string;
  @Column({ type: 'date' }) date: string;
  @Column({ default: 'Communication' }) category: string; // Note | Communication | Annonce | Information | Actualité
  @Column({ default: 'normal' }) priority: string; // urgent | important | normal | info
  @Column({ default: 'published' }) status: string;
  @CreateDateColumn() createdAt: Date;
}
