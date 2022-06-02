import {
  Inject,
  Controller,
  Patch,
  Body,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
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
import { UpdateUserProfileAndCheckPhoneDTO } from '../request/dto/update-user-profile-and-check-phone.dto';
import { updateUserProfileAndCheckPhoneSchema } from '../request/schema/update-user-profile-and-check-phone.schema';
import * as LibPhoneNumber from 'google-libphonenumber';
import { PHONE_NUMBER_IS_INVALID } from '../../common/error/keys';
import { checkPhoneNumber } from '../../common/helper/check-phone-number';
import { isDefined } from '../../common/helper/is-defined';
import { PositiveInfoService } from '../service/positive-info.service';
import { UserService } from '../service/user.service';
import { userMapper } from '../mapper/user.mapper';

@ApiBearerAuth()
@UseGuards(new RolesGuard(new Reflector()))
@UseGuards(AuthGuard('cognito'))
@ApiTags('user')
@Controller()
export class UpdateUserProfileController {
  constructor(
    private readonly profileService: ProfileService,
    private readonly positiveInfoService: PositiveInfoService,
    private readonly unconfirmedEmailService: UnconfirmedEmailService,
    private readonly notificationService: NotificationService,
    @Inject(DICTIONARY.CONFIG) private readonly config: ConfigService,
    @Inject(DICTIONARY.GOOGLE_PHONE_NUMBER)
    private readonly phoneUtil: LibPhoneNumber.PhoneNumberUtil,
    private readonly userService: UserService,
  ) {}

  @ApiResponse({ status: 200, type: ProfileRO })
  @ApiResponse({ status: 400, type: ErrorMessageRO })
  @ApiOperation({ summary: 'Edit profile by user with phone check' })
  @Roles([ROLES.USER])
  @Patch('api/v2/user')
  async updateUserProfileAndCheckPhoneNumber(
    @User() logged: UserEntity,
    @Body(new ValidationPipe(updateUserProfileAndCheckPhoneSchema))
    data: UpdateUserProfileAndCheckPhoneDTO
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

    return this.updateUserProfile(logged, omit(data, ['countryCode']));
  }

  positiveInfoFlowHasChanged(
    profile: ProfileEntity,
    data: UpdateUserProfileDTO
  ) {
    if (
      (isDefined(data.regularPushNotification) &&
        profile?.regularPushNotification !== data.regularPushNotification) ||
      (isDefined(data.positiveInfoPeriod) &&
        profile?.positiveInfoPeriod !== data.positiveInfoPeriod) ||
      (!profile?.regularPushNotification &&
        !profile?.positiveInfoPeriod &&
        data.positiveInfoPeriod) ||
      (profile?.regularPushNotification &&
        !profile?.frequencyOfRegularNotification &&
        data.frequencyOfRegularNotification) ||
      (isDefined(data.automatedEmergency) &&
        profile?.automatedEmergency !== data.automatedEmergency)
    ) {
      return true;
    }

    return false;
  }

  async updateUserProfile(logged: UserEntity, data: UpdateUserProfileDTO) {
    let profile = await this.profileService.findByUserId(logged.id);

    if (data.email && logged.email !== data.email) {
      await this.generateAndSendCodeConfirmingEmailChange(
        data,
        logged,
        profile
      );
    }

    const positiveInfoFlowHasChanged = this.positiveInfoFlowHasChanged(
      profile,
      data
    );

    profile = await this.profileService.saveProfile(
      { ...profile, userId: logged.id },
      omit(data, ['email'])
    );

    if (positiveInfoFlowHasChanged) {
      await this.positiveInfoService.savePositiveInfo(logged.id, {
        minutesToNext: profile.regularPushNotification
          ? profile.frequencyOfRegularNotification
          : profile.positiveInfoPeriod,
      });
    }

    return userMapper(await this.userService.findByIdOrFail(logged.id), null);
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
    const emailData = this.notificationService.prepareEmailData(
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

    await this.notificationService.sendEmail({
      data: emailData,
    });
  }
}
