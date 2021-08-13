import { ApiProperty } from '@nestjs/swagger';
import { UpdateContactDTO } from './update-contact.dto';

export class UpdateContactAndCheckPhoneDTO extends UpdateContactDTO {
  @ApiProperty({ type: String, maxLength: 2, required: false })
  countryCode: string;
}
