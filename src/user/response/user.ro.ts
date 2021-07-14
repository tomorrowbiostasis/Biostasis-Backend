import {
  Exclude,
  Expose,
  Transform,
  TransformFnParams,
} from 'class-transformer';
import * as moment from 'moment';
import { ApiProperty } from '@nestjs/swagger';
import { ROLES } from '../entity/user.entity';

@Exclude()
export class UserRO {
  @Expose()
  @ApiProperty({ type: String })
  id: string;

  @Expose()
  @ApiProperty({
    type: 'enum',
    enum: Object.values(ROLES).filter((value) => Number.isInteger(value)),
  })
  role: ROLES;

  @Expose()
  @ApiProperty({ type: String })
  email?: string;

  @Expose()
  @ApiProperty({ type: String })
  createdAt: string;

  @Expose()
  @ApiProperty({ type: String })
  updatedAt: string;
}
