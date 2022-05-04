import { ApiProperty } from "@nestjs/swagger";
import { MESSAGE_TYPE } from "../../enum/message-type.enum";

export class SendEmergencyMessageDTO {
  @ApiProperty({ type: Boolean, required: false })
  delayed?: boolean;

  @ApiProperty({
    type: "enum",
    enum: MESSAGE_TYPE,
    example: MESSAGE_TYPE.HEART_RATE_INVALID,
  })
  messageType?: string;
}
