import { ApiProperty } from '@nestjs/swagger';

export class ExportUserDataDTO {
  @ApiProperty({ type: String, maxLength: 320, required: false })
  email: string;
}
