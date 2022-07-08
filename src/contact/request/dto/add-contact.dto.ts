import { ApiProperty } from '@nestjs/swagger';

export class AddContactDTO {
  @ApiProperty({ type: String, maxLength: 100 })
  name: string;

  @ApiProperty({ type: String, maxLength: 100 })
  surname: string;

  @ApiProperty({ type: String, maxLength: 320, required: false })
  email: string;

  @ApiProperty({ type: Number, maxLength: 3, required: false })
  prefix: number;

  @ApiProperty({
    type: String,
    maxLength: 12,
    required: false,
    example: '123456789',
  })
  phone: string;

  @ApiProperty({ type: Boolean, required: false })
  active: boolean;
}
