import { ApiProperty } from '@nestjs/swagger';

export class SendEmergencyMessageDTO {
  @ApiProperty({ type: String, required: false })
  locationUrl: string;
}
