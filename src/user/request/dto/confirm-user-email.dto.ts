import { ApiProperty } from '@nestjs/swagger';

export class ConfirmUserEmailDTO {
  @ApiProperty({ type: String, maxLength: 36, required: true })
  code: string;
}
