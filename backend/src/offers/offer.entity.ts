import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('offers')
export class Offer {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() title: string;
  @Column({ type: 'text' }) description: string;
  @Column() partner: string;
  @Column() discount: string;
  @Column({ type: 'date' }) date: string;
  @Column({ default: 'active' }) status: string; // active | expired
  @CreateDateColumn() createdAt: Date;
}
