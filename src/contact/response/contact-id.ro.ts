import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class ContactIdRO {
  @Expose()
  @ApiProperty({ type: String })
  id: string;
}
