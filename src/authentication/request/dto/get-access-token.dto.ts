import { ApiProperty } from '@nestjs/swagger';

export class GetAccessTokenDTO {
  @ApiProperty({ type: String })
  email: string;

  @ApiProperty({ type: String })
  password: string;
}
