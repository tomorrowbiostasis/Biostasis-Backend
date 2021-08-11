import { Inject, Controller, Patch, Body, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiResponse,
  ApiOperation,
} from '@nestjs/swagger';
import * as configLib from 'config';
import { RolesGuard } from '../../authentication/roles.guard';
import { Roles } from '../../authentication/decorator/roles.decorator';
import { Reflector } from '@nestjs/core';
import { ProfileService } from '../service/profile.service';
import { User } from '../../authentication/decorator/user.decorator';
import { UserEntity, ROLES } from '../../user/entity/user.entity';
import { ProfileRO } from '../response/profile.ro';
import { UpdateUserProfileDTO } from '../request/dto/update-user-profile.dto';
import { updateUserProfileSchema } from '../request/schema/update-user-profile.schema';
import { ValidationPipe } from '../../common/pipe/validation.pipe';
import { AuthGuard } from '@nestjs/passport';
import { ErrorMessageRO } from '../../common/response/error.ro';
import { UnconfirmedEmailService } from '../service/unconfirmed-email.service';
import { NotificationService } from '../../notification/service/notification.service';
import { getMailTemplateId } from '../../notification/helper/get-template-id';
import { getNameOrEmail } from '../../common/helper/get-name-or-email';
import { DICTIONARY } from '../../common/constant/dictionary.constant';
import { ProfileEntity } from '../../user/entity/profile.entity';
import { omit } from '../../common/helper/omit';
import { profileMapper } from '../mapper/profile.mapper';

@ApiBearerAuth()
@UseGuards(new RolesGuard(new Reflector()))
@UseGuards(AuthGuard('cognito'))
@ApiTags('user')
@Controller('user')
export class UpdateUserProfileController {
  constructor(
    private readonly profileService: ProfileService,
    private readonly unconfirmedEmailService: UnconfirmedEmailService,
    private readonly notificationService: NotificationService,
    @Inject(DICTIONARY.CONFIG) private readonly config: configLib.IConfig
  ) {}

  @ApiResponse({ status: 200, type: ProfileRO })
  @ApiResponse({ status: 400, type: ErrorMessageRO })
  @ApiOperation({ summary: 'Edit profile by user' })
  @Roles([ROLES.USER])
  @Patch()
  async updateUserProfile(
    @User() logged: UserEntity,
    @Body(new ValidationPipe(updateUserProfileSchema))
    data: UpdateUserProfileDTO
  ) {
    let profile = await this.profileService.findByUserId(logged.id);

    if (data.email && logged.email !== data.email) {
      await this.generateAndSendCodeConfirmingEmailChange(
        data,
        logged,
        profile
      );
    }

    profile = await this.profileService.saveProfile(
      { ...profile, userId: logged.id },
      omit(data, ['email'])
    );

    return profileMapper(profile);
  }

  async generateAndSendCodeConfirmingEmailChange(
    data: UpdateUserProfileDTO,
    user: UserEntity,
    profile: ProfileEntity
  ) {
    const unconfirmedEmail =
      await this.unconfirmedEmailService.saveUnconfirmedEmail(
        user.id,
        data.email
      );

    await this.notificationService.sendEmail(
      getMailTemplateId('USER_CHANGE_EMAIL'),
      {
        username: getNameOrEmail(
          data.name ?? profile?.name,
          data.surname ?? profile?.surname,
          user.email
        ),
        domain: this.config.get('backend.url'),
        code: unconfirmedEmail.code,
        email: data.email,
      },
      {},
      [
        {
          Email: user.email,
        },
      ]
    );
  }
}
