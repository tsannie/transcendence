import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PlayerEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ nullable: true })
  name: string; 

  @Column({ default: 0 })
  score: number = 0;

  @Column('boolean', { default: false })
  won: boolean = false;
}
