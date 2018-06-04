import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Points } from './Points';

@Entity()
export class User {

  @PrimaryColumn()
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @OneToMany(() => Points, points => points.user)
  points: Points[];
}
