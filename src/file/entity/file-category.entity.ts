import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { FileEntity } from './file.entity';

@Entity('file_category')
export class FileCategoryEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'varchar' })
  code: string;

  @Column({ type: 'tinyint' })
  limit: number;

  @OneToMany(() => FileEntity, (file) => file.category)
  files: FileEntity[];

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;
}
