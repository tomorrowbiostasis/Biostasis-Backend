import {
  Controller,
  Patch,
  Body,
  UseGuards,
  Param,
  Inject,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { RolesGuard } from '../../authentication/roles.guard';
import { Roles } from '../../authentication/decorator/roles.decorator';
import { Reflector } from '@nestjs/core';
import { plainToClass } from 'class-transformer';
import { ContactService } from '../service/contact.service';
import { User } from '../../authentication/decorator/user.decorator';
import { UserEntity, ROLES } from '../../user/entity/user.entity';
import { ContactRO } from '../response/contact.ro';
import { UpdateContactDTO } from '../request/dto/update-contact.dto';
import { updateContactSchema } from '../request/schema/update-contact.schema';
import { ValidationPipe } from '../../common/pipe/validation.pipe';
import { AuthGuard } from '@nestjs/passport';
import { NumericIdValidationPipe } from '../../common/pipe/numeric-id-validation.pipe';
import { ErrorMessageRO } from '../../common/response/error.ro';
import * as LibPhoneNumber from 'google-libphonenumber';
import { DICTIONARY } from '../../common/constant/dictionary.constant';
import { UpdateContactAndCheckPhoneDTO } from '../request/dto/update-contact-and-check-phone.dto';
import { updateContactAndCheckPhoneSchema } from '../request/schema/update-contact-and-check-phone.schema';
import { PHONE_NUMBER_IS_INVALID } from '../../common/error/keys';
import { checkPhoneNumber } from '../../common/helper/check-phone-number';
import { omit } from '../../common/helper/omit';

@ApiBearerAuth()
@UseGuards(new RolesGuard(new Reflector()))
@UseGuards(AuthGuard('cognito'))
@ApiTags('contact')
@Controller()
export class UpdateContactController {
  constructor(
    private readonly contactService: ContactService,
    @Inject(DICTIONARY.GOOGLE_PHONE_NUMBER)
    private readonly phoneUtil: LibPhoneNumber.PhoneNumberUtil
  ) {}

  @ApiResponse({ status: 200, type: ContactRO })
  @ApiResponse({ status: 400, type: ErrorMessageRO })
  @ApiOperation({ summary: 'Update contact by user with phone check' })
  @Roles([ROLES.USER])
  @Patch('api/v2/contact/:id')
  async updateContactAndCheckPhoneNumber(
    @User() user: UserEntity,
    @Param('id', new NumericIdValidationPipe()) contactId: number,
    @Body(new ValidationPipe(updateContactAndCheckPhoneSchema))
    data: UpdateContactAndCheckPhoneDTO
  ) {
    if (
      data.phone &&
      !checkPhoneNumber(
        this.phoneUtil,
        data.prefix,
        data.phone,
        data.countryCode
      )
    ) {
      throw new BadRequestException(PHONE_NUMBER_IS_INVALID);
    }

    return this.updateContact(user, contactId, omit(data, ['countryCode']));
  }

  @ApiResponse({ status: 200, type: ContactRO })
  @ApiResponse({ status: 400, type: ErrorMessageRO })
  @ApiOperation({ summary: 'Update contact by user' })
  @Roles([ROLES.USER])
  @Patch('contact/:id')
  async updateContactWithoutPhoneNumberVerification(
    @User() user: UserEntity,
    @Param('id', new NumericIdValidationPipe()) contactId: number,
    @Body(new ValidationPipe(updateContactSchema))
    data: UpdateContactDTO
  ) {
    return this.updateContact(user, contactId, data);
  }

  async updateContact(
    user: UserEntity,
    contactId: number,
    data: UpdateContactDTO
  ) {
    let contact = await this.contactService.findByIdAndUserIdOrFail(
      contactId,
      user.id
    );

    await this.contactService.updateContact(contact, data);

    contact = await this.contactService.findById(contactId);

    return plainToClass(ContactRO, contact);
  }
}
