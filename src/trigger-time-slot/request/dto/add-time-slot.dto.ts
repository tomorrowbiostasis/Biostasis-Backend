import { ApiProperty } from '@nestjs/swagger';
import { DAYS_OF_WEEKS } from '../../enum/days-of-week.enum';
import { getEnumKeys } from '../../../common/helper/get-enum-keys';

export class AddTimeSlotDTO {
  @ApiProperty({ type: Boolean, required: false })
  active?: boolean;

  @ApiProperty({ type: Date, required: false })
  from?: Date;

  @ApiProperty({ type: Date, required: true })
  to: Date;

  @ApiProperty({ type: String, required: true })
  timezone: string;

  @ApiProperty({
    type: 'enum',
    required: false,
    isArray: true,
    enum: getEnumKeys(DAYS_OF_WEEKS, true),
    example: [getEnumKeys(DAYS_OF_WEEKS, true)[0]],
  })
  days: string[];
}
