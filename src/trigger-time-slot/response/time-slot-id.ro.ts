import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class TimeSlotIdRO {
  @Expose()
  @ApiProperty({ type: Number })
  id: number;
}
