import { Controller, Patch, Body, UseGuards } from '@nestjs/common';
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
import { ProfileRO } from '../response/profile.ro';
import { UpdateUserProfileDTO } from '../request/dto/update-user-profile.dto';
import { updateUserProfileSchema } from '../request/schema/update-user-profile.schema';
import { ValidationPipe } from '../../common/pipe/validation.pipe';
import { AuthGuard } from '@nestjs/passport';
import { profileMapper } from '../mapper/profile.mapper';
import { ErrorMessageRO } from '../../common/response/error.ro';

@ApiBearerAuth()
@UseGuards(new RolesGuard(new Reflector()))
@UseGuards(AuthGuard('cognito'))
@ApiTags('user')
@Controller('user')
export class UpdateUserProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @ApiResponse({ status: 200, type: ProfileRO })
  @ApiResponse({ status: 400, type: ErrorMessageRO })
  @ApiOperation({ summary: 'Edit profile by user' })
  @Roles([ROLES.USER])
  @Patch()
  async updateProfile(
    @User() logged: UserEntity,

    @Body(new ValidationPipe(updateUserProfileSchema))
    data: UpdateUserProfileDTO
  ) {
    await this.profileService.saveProfile(logged.id, data);

    const profile = await this.profileService.findByUserId(logged.id);

    return profileMapper(profile);
  }
}
