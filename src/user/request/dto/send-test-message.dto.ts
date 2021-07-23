import { ApiProperty } from '@nestjs/swagger';

export class SendTestMessageDTO {
  @ApiProperty({ type: String, required: false })
  locationUrl: string;
}
