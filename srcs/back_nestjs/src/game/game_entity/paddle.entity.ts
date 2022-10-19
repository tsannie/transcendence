import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PaddleEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ nullable: true, type: 'float' })
  x: number;

  @Column({ nullable: true, type: 'float' })
  y: number;

  @Column({ nullable: true, type: 'float' })
  width: number;

  @Column({ nullable: true, type: 'float' })
  height: number;
}
