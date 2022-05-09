import { Controller, Post, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { UserService } from '../../user/service/user.service';
import { User } from '../decorator/user.decorator';
import { UserEntity } from '../../user/entity/user.entity';
import { PositiveInfoService } from '../../user/service/positive-info.service';
import { ProfileService } from '../../user/service/profile.service';

@ApiBearerAuth()
@UseGuards(AuthGuard('cognito'))
@ApiTags('auth')
@Controller('auth')
export class LogoutController {
  constructor(
    private readonly userService: UserService,
    private readonly profileService: ProfileService,
    private readonly positiveInfoService: PositiveInfoService
  ) {}

  @ApiResponse({ status: 200 })
  @ApiOperation({ summary: 'Logout from the application' })
  @Post('logout')
  async logout(@User() user: UserEntity) {
    let profile = await this.profileService.findByUserId(user.id);

    if (profile) {
      await this.profileService.saveProfile(
        { ...profile, userId: user.id },
        { automatedEmergency: false } as any
      )
    }

    await Promise.all([
      this.positiveInfoService.savePositiveInfo(user.id, null),
      this.userService.updateUserDeviceId(user.id, null)
    ]);
  }
}
