import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserProfileDTO {
  @ApiProperty({ type: String, maxLength: 100, required: false })
  name: string;

  @ApiProperty({ type: String, maxLength: 100, required: false })
  surname: string;

  @ApiProperty({ type: Number, maxLength: 3, required: false })
  prefix: number;

  @ApiProperty({ type: String, maxLength: 12, required: false })
  phone: string;

  @ApiProperty({ type: String, maxLength: 200, required: false })
  address: string;

  @ApiProperty({ type: String, required: false, example: '12/08/1986' })
  dateOfBirth: string;
}
