import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('meetings')
export class Meeting {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() title: string;
  @Column({ type: 'date' }) date: string;
  @Column() time: string;
  @Column() location: string;
  @Column({ default: 0 }) participants: number;
  @Column({ type: 'text', nullable: true }) description: string;
  @Column({ default: 'upcoming' }) status: string; // upcoming | ongoing | done | cancelled
  @CreateDateColumn() createdAt: Date;
}
