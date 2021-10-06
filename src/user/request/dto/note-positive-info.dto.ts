import { ApiProperty } from '@nestjs/swagger';

export class NotePositiveInfoDTO {
  @ApiProperty({ type: Number, maxLength: 720, required: true })
  minutesToNext: number;

  @ApiProperty({ type: String, required: false })
  locationUrl?: string;
}
