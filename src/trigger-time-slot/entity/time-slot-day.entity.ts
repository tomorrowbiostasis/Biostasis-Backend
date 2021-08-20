import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { TimeSlotEntity } from './time-slot.entity';

@Entity('time_slot_day')
export class TimeSlotDayEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ name: 'time_slot_id', type: 'int' })
  timeSlotId: number;

  @Column({ name: 'day_of_week', type: 'int' })
  day: number;

  @JoinColumn({ name: 'time_slot_id' })
  @ManyToOne(() => TimeSlotEntity, (timeSlot) => timeSlot.days)
  timeSlot: TimeSlotEntity;
}
