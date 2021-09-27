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
import { UserService } from '../service/user.service';
import { User } from '../../authentication/decorator/user.decorator';
import { UserEntity, ROLES } from '../../user/entity/user.entity';
import { ValidationPipe } from '../../common/pipe/validation.pipe';
import { AuthGuard } from '@nestjs/passport';
import { ErrorMessageRO } from '../../common/response/error.ro';
import { UpdateUserDeviceIdDTO } from '../request/dto/update-user-device-id.dto';
import { updateUserDeviceIdSchema } from '../request/schema/update-user-device-id.schema';
import { SuccessRO } from '../../common/response/success.ro';
import { plainToClass } from 'class-transformer';

@ApiBearerAuth()
@UseGuards(new RolesGuard(new Reflector()))
@UseGuards(AuthGuard('cognito'))
@ApiTags('user')
@Controller('user')
export class UpdateUserDeviceIdentifierController {
  constructor(private readonly userService: UserService) {}

  @ApiResponse({ status: 200, type: SuccessRO })
  @ApiResponse({ status: 400, type: ErrorMessageRO })
  @ApiOperation({ summary: 'Edit device identifier by user' })
  @Roles([ROLES.USER])
  @Patch('device')
  async updateUserDeviceIdentifierController(
    @User() logged: UserEntity,
    @Body(new ValidationPipe(updateUserDeviceIdSchema))
    data: UpdateUserDeviceIdDTO
  ) {
    const result = await this.userService.updateUserDeviceId(
      logged.id,
      data.deviceId
    );

    return plainToClass(SuccessRO, {
      success: !!result.affected,
    });
  }
}
