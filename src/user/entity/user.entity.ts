import {
  Column,
  Entity,
  PrimaryColumn,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ContactEntity } from '../../contact/entity/contact.entity';

export enum ROLES {
  USER = 0,
}

@Entity('user')
export class UserEntity {
  @PrimaryColumn({ type: 'varchar', length: 36 })
  id: string;

  @Column({ type: 'enum', enum: [ROLES.USER] })
  role: ROLES;

  @Column({ name: 'email', type: 'varchar', length: 320 })
  @Index({ unique: true })
  email: string;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt: Date;

  @OneToMany(() => ContactEntity, (contact) => contact.user)
  contacts: ContactEntity[];
}
