import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class TokenRO {
  @Expose({ name: 'AccessToken' })
  @ApiProperty({ type: String })
  token: string;
}
