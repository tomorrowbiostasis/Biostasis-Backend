import { ApiProperty } from "@nestjs/swagger";
import { UpdateUserProfileDTO } from "./update-user-profile.dto";

export class UpdateUserProfileAndCheckPhoneDTO extends UpdateUserProfileDTO {
  @ApiProperty({ type: String, maxLength: 2, required: false })
  countryCode: string;
}
