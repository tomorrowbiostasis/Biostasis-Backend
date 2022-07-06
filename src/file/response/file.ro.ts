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

  @Exclude()
  @ApiProperty({ type: Number })
  size: number;

  @Expose()
  @ApiProperty({ type: String })
  mimeType: string;

  @Exclude()
  @ApiProperty({ type: String })
  url: string;

  @Expose()
  @ApiProperty({ type: String })
  createdAt: string;
}
