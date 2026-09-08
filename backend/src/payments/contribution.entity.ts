import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('contributions')
export class Contribution {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() user: string;
  @Column('numeric', { precision: 12, scale: 2 }) amount: number;
  @Column({ type: 'date' }) date: string;
  @CreateDateColumn() createdAt: Date;
}
