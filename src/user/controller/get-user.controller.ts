import { Controller, Get, UseGuards } from '@nestjs/common';
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
import { UserRO } from '../response/user.ro';
import { AuthGuard } from '@nestjs/passport';
import { userMapper } from '../mapper/user.mapper';
import { MessageService } from '../../queue/service/message.service';

@ApiBearerAuth()
@UseGuards(new RolesGuard(new Reflector()))
@UseGuards(AuthGuard('cognito'))
@ApiTags('user')
@Controller('user')
export class GetUserController {
  constructor(
    private readonly userService: UserService,
    private readonly messageService: MessageService
  ) {}

  @ApiResponse({ status: 200, type: UserRO })
  @ApiOperation({ summary: 'Get user profile' })
  @Roles([ROLES.USER])
  @Get()
  async getUserProfile(@User() user: UserEntity) {
    const [details, trigger] = await Promise.all([
      this.userService.findByIdOrFail(user.id),
      this.messageService.findJobByUserId(user.id),
    ]);

    return userMapper(details, trigger);
  }
}
