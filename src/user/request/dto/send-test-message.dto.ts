import { ApiProperty } from '@nestjs/swagger';

export class SendTestMessageDTO {
  @ApiProperty({ type: Number, required: false })
  latitude: number;

  @ApiProperty({ type: Number, required: false })
  longitude: number;

  @ApiProperty({ type: Number, required: false })
  accuracy: number;

  @ApiProperty({ type: String, required: false })
  locationUrl: string;
}
