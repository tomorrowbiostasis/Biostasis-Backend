import {
  Controller,
  Post,
  Body,
  UseGuards,
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
import { ContactIdRO } from '../response/contact-id.ro';
import { AddContactDTO } from '../request/dto/add-contact.dto';
import { addContactSchema } from '../request/schema/add-contact.schema';
import { ValidationPipe } from '../../common/pipe/validation.pipe';
import { AuthGuard } from '@nestjs/passport';
import { ErrorMessageRO } from '../../common/response/error.ro';
import * as LibPhoneNumber from 'google-libphonenumber';
import { checkPhoneNumber } from '../../common/helper/check-phone-number';
import { AddContactAndCheckPhoneDTO } from '../request/dto/add-contact-and-check-phone.dto';
import { addContactAndCheckPhoneSchema } from '../request/schema/add-contact-and-check-phone.schema';
import { PHONE_NUMBER_IS_INVALID } from '../../common/error/keys';
import { DICTIONARY } from '../../common/constant/dictionary.constant';
import { omit } from '../../common/helper/omit';

@ApiBearerAuth()
@UseGuards(new RolesGuard(new Reflector()))
@UseGuards(AuthGuard('cognito'))
@ApiTags('contact')
@Controller()
export class AddContactController {
  constructor(
    private readonly contactService: ContactService,
    @Inject(DICTIONARY.GOOGLE_PHONE_NUMBER)
    private readonly phoneUtil: LibPhoneNumber.PhoneNumberUtil
  ) {}

  @ApiResponse({ status: 201, type: ContactIdRO })
  @ApiResponse({ status: 400, type: ErrorMessageRO })
  @ApiOperation({ summary: 'Add contact by user with phone check' })
  @Roles([ROLES.USER])
  @Post('api/v2/contact')
  async addContactAndCheckPhoneNumber(
    @User() user: UserEntity,
    @Body(new ValidationPipe(addContactAndCheckPhoneSchema))
    data: AddContactAndCheckPhoneDTO
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

    const contact = await this.contactService.saveContact(
      user.id,
      omit(data, ['countryCode'])
    );

    return plainToClass(ContactIdRO, contact);
  }

  @ApiResponse({ status: 201, type: ContactIdRO })
  @ApiResponse({ status: 400, type: ErrorMessageRO })
  @ApiOperation({ summary: 'Add contact by user' })
  @Roles([ROLES.USER])
  @Post('contact')
  async addContactWithoutPhoneNumberVerification(
    @User() user: UserEntity,
    @Body(new ValidationPipe(addContactSchema))
    data: AddContactDTO
  ) {
    const contact = await this.contactService.saveContact(user.id, data);

    return plainToClass(ContactIdRO, contact);
  }
}
