import { ApiProperty } from '@nestjs/swagger';

export class SendTestEmergencyMessageDTO {
  @ApiProperty({ type: String, required: false })
  locationUrl: string;
}
