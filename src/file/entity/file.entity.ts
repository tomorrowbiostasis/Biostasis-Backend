import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { UserEntity } from '../../user/entity/user.entity';
import { FileCategoryEntity } from './file-category.entity';

@Entity('file')
export class FileEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ name: 'user_id', type: 'varchar', length: 36 })
  userId: string;

  @Column({ name: 'category_id', type: 'tinyint' })
  categoryId: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 100 })
  key: string;

  @Column({ name: 'mime_type', type: 'varchar', length: 50 })
  mimeType: string;

  @Column({ type: 'mediumint' })
  size: number;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  @JoinColumn({ name: 'user_id' })
  @ManyToOne(() => UserEntity, (user: UserEntity) => user.files)
  user: UserEntity;

  @JoinColumn({ name: 'category_id' })
  @ManyToOne(
    () => FileCategoryEntity,
    (category: FileCategoryEntity) => category.files
  )
  category: FileCategoryEntity;
}
