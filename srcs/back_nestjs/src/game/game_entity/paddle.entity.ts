import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PaddleEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: number;

  @Column({nullable: true, type: 'float'})
  x: number;

  @Column({nullable: true, type: 'float'})
  y: number;

  @Column({ default: 80 })
  width: number;

  @Column({ default: 20 })
  height: number;

  @Column({ default: 'white' })
  color: string = 'white';
}
