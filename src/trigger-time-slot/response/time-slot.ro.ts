import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class TimeSlotRO {
  @Expose()
  @ApiProperty({ type: Number })
  id: number;

  @Expose()
  @ApiProperty({ type: Boolean })
  active: boolean;

  @Expose()
  @ApiProperty({ type: String })
  from: string;

  @Expose()
  @ApiProperty({ type: String })
  to: string;

  @Expose()
  @ApiProperty({ type: String })
  timezone: string;

  @Expose()
  @ApiProperty({ type: String, isArray: true })
  days: string[];

  @Expose()
  @ApiProperty({ type: String })
  createdAt: string;
}
