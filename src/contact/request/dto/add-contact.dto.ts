import { ApiProperty } from '@nestjs/swagger';

export class AddContactDTO {
  @ApiProperty({ type: String, maxLength: 100 })
  name: string;

  @ApiProperty({ type: String, maxLength: 100 })
  surname: string;

  @ApiProperty({ type: String, maxLength: 320 })
  email: string;

  @ApiProperty({ type: Number, maxLength: 3 })
  prefix: string;

  @ApiProperty({ type: String, maxLength: 20 })
  phone: string;

  @ApiProperty({ type: Boolean, required: false })
  active: boolean;
}
