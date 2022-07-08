import { ApiProperty } from '@nestjs/swagger';
import { AddContactDTO } from './add-contact.dto';

export class AddContactAndCheckPhoneDTO extends AddContactDTO {
  @ApiProperty({ type: String, maxLength: 2, required: false })
  countryCode: string;
}
