import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ROLES } from '../entity/user.entity';
import { ProfileRO } from './profile.ro';
import { Boolean } from 'aws-sdk/clients/batch';

@Exclude()
export class UserRO extends ProfileRO {
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

  @Expose()
  @ApiProperty({ type: Number })
  fillLevel: number;

  @Exclude()
  userId = undefined;

  @Expose()
  @ApiProperty({ type: Boolean })
  isEmergencyTriggerActive: Boolean;
}
