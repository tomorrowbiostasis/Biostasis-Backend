import {
  Controller,
  Post,
  UseGuards,
  Body,
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
import { User } from '../../authentication/decorator/user.decorator';
import { UserEntity, ROLES } from '../../user/entity/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { SuccessRO } from '../../common/response/success.ro';
import { plainToClass } from 'class-transformer';
import { ValidationPipe } from '../../common/pipe/validation.pipe';
import { NotePositiveInfoDTO } from '../request/dto/note-positive-info.dto';
import { notePositiveInfoSchema } from '../request/schema/note-positive-info.schema';
import { PositiveInfoService } from '../service/positive-info.service';
import { ProfileService } from '../service/profile.service';
import { MINUTES_TO_NEXT_MESSAGE_ARE_REQUIRED } from '../../common/error/keys';

@ApiBearerAuth()
@UseGuards(new RolesGuard(new Reflector()))
@UseGuards(AuthGuard('cognito'))
@ApiTags('user')
@Controller('user')
export class NotePositiveInfoController {
  constructor(
    private readonly positiveInfoService: PositiveInfoService,
    private readonly profileService: ProfileService
  ) {}

  @ApiResponse({ status: 200, type: SuccessRO })
  @ApiOperation({ summary: 'Take note of positive information' })
  @Roles([ROLES.USER])
  @Post('/positive-info')
  async notePositiveInfo(
    @User() user: UserEntity,
    @Body(new ValidationPipe(notePositiveInfoSchema))
    data: NotePositiveInfoDTO
  ) {
    const profile = await this.profileService.findByUserId(user.id);

    if (!profile.regularPushNotification && !data.minutesToNext) {
      throw new BadRequestException(MINUTES_TO_NEXT_MESSAGE_ARE_REQUIRED);
    }

    let success = false;

    if (profile?.automatedEmergency) {
      await this.positiveInfoService.savePositiveInfo(
        user.id,
        data
      );

      success = true;
    }

    return plainToClass(SuccessRO, { success });
  }
}
