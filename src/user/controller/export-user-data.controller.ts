import { Controller, Post, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { RolesGuard } from '../../authentication/roles.guard';
import { Roles } from '../../authentication/decorator/roles.decorator';
import { Reflector } from '@nestjs/core';
import { ProfileService } from '../service/profile.service';
import { User } from '../../authentication/decorator/user.decorator';
import { UserEntity, ROLES } from '../../user/entity/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { NotificationService } from '../../notification/service/notification.service';
import { getMailTemplateId } from '../../notification/helper/get-template-id';
import { getNameOrEmail } from '../../common/helper/get-name-or-email';
import { SuccessRO } from '../../common/response/success.ro';
import { plainToClass } from 'class-transformer';

@ApiBearerAuth()
@UseGuards(new RolesGuard(new Reflector()))
@UseGuards(AuthGuard('cognito'))
@ApiTags('user')
@Controller('user')
export class ExportUserDataController {
  constructor(
    private readonly profileService: ProfileService,
    private readonly notificationService: NotificationService
  ) {}

  @ApiResponse({ status: 200, type: SuccessRO })
  @ApiOperation({ summary: 'Export user data' })
  @Roles([ROLES.USER])
  @Post('/export')
  async exportUserData(@User() user: UserEntity) {
    const profile = await this.profileService.findByUserId(user.id);
    const emailData = this.notificationService.prepareEmailData(
      getMailTemplateId('DATA_EXPORT'),
      {
        username: getNameOrEmail(profile?.name, profile?.surname, user.email),
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
      exportedData: true,
      userId: user.id,
    });

    return plainToClass(SuccessRO, { success: true });
  }
}
