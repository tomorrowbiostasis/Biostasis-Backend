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
import { TimeSlotDayEntity } from './time-slot-day.entity';

@Entity('time_slot')
export class TimeSlotEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ name: 'user_id', type: 'varchar', length: 36 })
  userId: string;

  @Column({ type: 'boolean' })
  active: boolean;

  @Column({ type: 'datetime' })
  from: Date;

  @Column({ type: 'datetime' })
  to: Date;

  @Column({ type: 'varchar', nullable: true })
  timezone?: string;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  @JoinColumn({ name: 'user_id' })
  @ManyToOne(() => UserEntity, (user: UserEntity) => user.contacts)
  user: UserEntity;

  @OneToMany(() => TimeSlotDayEntity, (daysOfWeek) => daysOfWeek.timeSlot, {
    cascade: true,
  })
  days: TimeSlotDayEntity[];
}
