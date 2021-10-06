import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { UserEntity } from '../../user/entity/user.entity';

@Entity('positive_info')
export class PositiveInfoEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ name: 'user_id', type: 'varchar', length: 36 })
  userId: string;

  @Column({ name: 'minutes_to_next', type: 'smallint' })
  minutesToNext: number;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'datetime' })
  updatedAt: string;

  @Column({ name: 'push_notification_time', type: 'datetime' })
  pushNotificationTime: Date;

  @Column({ name: 'sms_time', type: 'datetime' })
  smsTime: Date;

  @Column({ name: 'trigger_time', type: 'datetime' })
  triggerTime: Date;

  @Column({ type: 'varchar', length: 200 })
  location: string;

  @JoinColumn({ name: 'user_id' })
  @OneToOne(() => UserEntity, (user) => user.positiveInfo)
  user: UserEntity;
}
