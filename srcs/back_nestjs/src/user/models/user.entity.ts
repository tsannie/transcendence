import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";
//import * as bcrypt from 'bcrypt';

@Entity()
export class UserEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({unique: true})
  username: string;

  @Column({unique: true})
  email: string;

  @Column()
  password: string;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @CreateDateColumn()
  updatedAt: Date;

  // TODO HASH PASSWORD
  async hashPassword() {
    //this.password = await bcrypt.hash();
  }

  async goodPassword(tryPassword: string): Promise<boolean> {
    return (tryPassword === this.password)
  }
}
