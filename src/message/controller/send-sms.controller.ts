import {
  Controller,
  Post,
  Body,
  UseGuards,
  BadRequestException,
  Inject,
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
import { NotificationService } from '../../notification/service/notification.service';
import { User } from '../../authentication/decorator/user.decorator';
import { UserEntity, ROLES } from '../../user/entity/user.entity';
import { SuccessRO } from '../../common/response/success.ro';
import { SendSmsDTO } from '../request/dto/send-sms.dto';
import { sendSmsSchema } from '../request/schema/send-sms.schema';
import { ValidationPipe } from '../../common/pipe/validation.pipe';
import { AuthGuard } from '@nestjs/passport';
import { ErrorMessageRO } from '../../common/response/error.ro';
import { ProfileService } from '../../user/service/profile.service';
import { PHONE_NUMBER_IS_NEEDED } from '../../common/error/keys';
import { DICTIONARY } from '../../common/constant/dictionary.constant';
import { ConfigService } from '@nestjs/config';

@ApiBearerAuth()
@UseGuards(new RolesGuard(new Reflector()))
@UseGuards(AuthGuard('cognito'))
@ApiTags('message')
@Controller('message')
export class SendSMSController {
  constructor(
    @Inject(DICTIONARY.CONFIG) private readonly config: ConfigService,
    private readonly notificationService: NotificationService,
    private readonly profileService: ProfileService
  ) {}

  @ApiResponse({ status: 201, type: SuccessRO })
  @ApiResponse({ status: 400, type: ErrorMessageRO })
  @ApiOperation({ summary: 'Send sms message' })
  @Roles([ROLES.USER])
  @Post('send/sms')
  async sendSms(
    @User() user: UserEntity,
    @Body(new ValidationPipe(sendSmsSchema))
    data: SendSmsDTO
  ) {
    const profile = await this.profileService.findByUserId(user.id);

    if (!profile?.prefix) {
      throw new BadRequestException(PHONE_NUMBER_IS_NEEDED);
    }

    const smsData = this.notificationService.prepareSmsData(
      `${profile.prefix}${profile.phone}`,
      this.config.get(`sms.${data.messageType}`)
    );
    const result = await this.notificationService.sendSms({ data: smsData });

    return plainToClass(SuccessRO, {
      success: result ? !!!result.errorCode : false,
    });
  }
}
