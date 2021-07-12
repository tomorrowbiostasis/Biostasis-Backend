import { Controller, Patch, Body, UseGuards, Param } from '@nestjs/common';
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

@ApiBearerAuth()
@UseGuards(new RolesGuard(new Reflector()))
@UseGuards(AuthGuard('cognito'))
@ApiTags('contact')
@Controller('contact')
export class EditContactController {
  constructor(private readonly contactService: ContactService) {}

  @ApiResponse({ status: 201 })
  @ApiOperation({ summary: 'Edit contact by user' })
  @Roles([ROLES.USER])
  @Patch(':id')
  async updateContact(
    @User() user: UserEntity,
    @Param('id', new NumericIdValidationPipe()) contactId: number,
    @Body(new ValidationPipe(updateContactSchema))
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
