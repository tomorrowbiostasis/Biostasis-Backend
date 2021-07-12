import { Controller, Post, Body, UseGuards } from '@nestjs/common';
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
import { AddContactDTO } from '../request/dto/add-contact.dto';
import { addContactSchema } from '../request/schema/add-contact.schema';
import { ValidationPipe } from '../../common/pipe/validation.pipe';
import { AuthGuard } from '@nestjs/passport';

@ApiBearerAuth()
@UseGuards(new RolesGuard(new Reflector()))
@UseGuards(AuthGuard('cognito'))
@ApiTags('contact')
@Controller('contact')
export class AddContactController {
  constructor(private readonly contactService: ContactService) {}

  @ApiResponse({ status: 201, type: ContactRO })
  @ApiOperation({ summary: 'Add contact by user' })
  @Roles([ROLES.USER])
  @Post()
  async addContact(
    @User() user: UserEntity,
    @Body(new ValidationPipe(addContactSchema))
    data: AddContactDTO
  ) {
    const contact = await this.contactService.saveContact(user.id, data);

    return plainToClass(ContactRO, contact);
  }
}
