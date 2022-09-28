import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PlayerEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: number;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  score: number;

  @Column('boolean', { default: false })
  won: boolean;
}
