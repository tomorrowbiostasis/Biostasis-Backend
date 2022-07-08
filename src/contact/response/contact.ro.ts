import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class ContactRO {
  @Expose()
  @ApiProperty({ type: String })
  id: string;

  @Expose()
  @ApiProperty({ type: String })
  name?: string;

  @Expose()
  @ApiProperty({ type: String })
  surname?: string;

  @Expose()
  @ApiProperty({ type: String })
  phone?: string;

  @Expose()
  @ApiProperty({ type: Number })
  prefix?: number;

  @Expose()
  @ApiProperty({ type: String })
  email?: string;

  @Expose()
  @ApiProperty({ type: Boolean })
  active?: boolean;

  @Expose()
  @ApiProperty({ type: String })
  createdAt: string;

  @Expose()
  @ApiProperty({ type: String })
  updatedAt: string;
}
