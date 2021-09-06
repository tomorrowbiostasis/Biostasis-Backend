import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class FileRO {
  @Expose()
  @ApiProperty({ type: String })
  id: string;

  @Expose()
  @ApiProperty({ type: String })
  name: string;

  @Expose()
  @ApiProperty({ type: Number })
  size: number;

  @Expose()
  @ApiProperty({ type: String })
  mimeType: string;

  @Expose()
  @ApiProperty({ type: String })
  url: string;

  @Expose()
  @ApiProperty({ type: String })
  createdAt: string;
}
