import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

export class ErrorRO {
  @Expose()
  @ApiProperty({ type: Number })
  readonly status: number;

  @Expose()
  @ApiProperty({ type: String })
  readonly timestamp: string;

  @Expose()
  @ApiProperty({ type: String })
  readonly path: string;

  @Expose()
  @ApiProperty({ type: String })
  readonly method: string;

  @Expose()
  @ApiProperty({ type: String })
  readonly code: string;
}

@Exclude()
export class ErrorMessageRO {
  @Expose()
  @ApiProperty({ type: ErrorRO })
  readonly error: ErrorRO;
}
