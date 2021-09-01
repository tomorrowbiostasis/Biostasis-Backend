import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class FileIdRO {
  @Expose()
  @ApiProperty({ type: String })
  id: number;
}
