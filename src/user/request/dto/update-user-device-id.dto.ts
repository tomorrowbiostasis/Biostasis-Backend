import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDeviceIdDTO {
  @ApiProperty({ type: String, maxLength: 200, required: false })
  deviceId: string;
}
