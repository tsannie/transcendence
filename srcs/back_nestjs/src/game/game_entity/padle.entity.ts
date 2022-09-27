import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PadleEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: number;

  @Column({ default: 20 })
  x: number;

  @Column({ default: 3 })
  y: number;

  @Column({ default: 80 })
  width: number;

  @Column({ default: 20 })
  height: number;

  @Column({ default: 'white' })
  color: string = 'white';
}
