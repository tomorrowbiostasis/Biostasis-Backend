import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class SuccessRO {
  @Expose()
  @ApiProperty({ type: Boolean })
  readonly success: boolean;
}
