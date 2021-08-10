import { ApiProperty } from '@nestjs/swagger';
import { MESSAGE_TYPE } from '../../enum/message-type.enum';

export class SendSmsDTO {
  @ApiProperty({
    type: 'enum',
    enum: MESSAGE_TYPE,
    example: MESSAGE_TYPE.HEART_RATE_INVALID,
  })
  messageType: string;
}
