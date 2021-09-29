import { ApiProperty } from '@nestjs/swagger';

export class NotePositiveInfoDTO {
  @ApiProperty({ type: Number, maxLength: 1000, required: true })
  minutesToNext: number;
}
