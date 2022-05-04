import { ApiProperty } from '@nestjs/swagger';

export class NotePositiveInfoDTO {
  @ApiProperty({ type: Number, maxLength: 2880, required: true })
  minutesToNext: number;
}
