import { ApiProperty } from '@nestjs/swagger';

export class UpdateContactDTO {
  @ApiProperty({ type: String, maxLength: 100, required: false })
  name: string;

  @ApiProperty({ type: String, maxLength: 100, required: false })
  surname: string;

  @ApiProperty({ type: String, maxLength: 320, required: false })
  email: string;

  @ApiProperty({ type: Number, maxLength: 3, required: false })
  prefix: number;

  @ApiProperty({ type: String, maxLength: 20, required: false })
  phone: string;

  @ApiProperty({ type: Boolean, required: false })
  active: boolean;
}
