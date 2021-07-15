import { Controller, Get, UseGuards } from '@nestjs/common';
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
import { AuthGuard } from '@nestjs/passport';
import { ErrorMessageRO } from '../../common/response/error.ro';

@ApiBearerAuth()
@UseGuards(new RolesGuard(new Reflector()))
@UseGuards(AuthGuard('cognito'))
@ApiTags('contact')
@Controller('contact')
export class ContactListController {
  constructor(private readonly contactService: ContactService) {}

  @ApiResponse({ status: 200, type: ContactRO, isArray: true })
  @ApiResponse({ status: 400, type: ErrorMessageRO })
  @ApiOperation({ summary: 'Get contact list' })
  @Roles([ROLES.USER])
  @Get()
  async getContactList(@User() user: UserEntity) {
    const contacts = await this.contactService.findContactsByUserId(user.id);

    return contacts.map((contact) => plainToClass(ContactRO, contact));
  }
}
