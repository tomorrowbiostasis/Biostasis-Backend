import {
  Controller,
  Delete,
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
import { RolesGuard } from '../../authentication/roles.guard';
import { Roles } from '../../authentication/decorator/roles.decorator';
import { Reflector } from '@nestjs/core';
import { MessageService } from '../../queue/service/message.service';
import { User } from '../../authentication/decorator/user.decorator';
import { UserEntity, ROLES } from '../../user/entity/user.entity';
import { SuccessRO } from '../../common/response/success.ro';
import { AuthGuard } from '@nestjs/passport';
import { ErrorMessageRO } from '../../common/response/error.ro';

@ApiBearerAuth()
@UseGuards(new RolesGuard(new Reflector()))
@UseGuards(AuthGuard('cognito'))
@ApiTags('message')
@Controller('message')
export class CancelEmergencyMessageController {
  constructor(private readonly messageService: MessageService) {}

  @ApiResponse({ status: 201, type: SuccessRO })
  @ApiResponse({ status: 400, type: ErrorMessageRO })
  @ApiOperation({ summary: 'Cancel emergency message' })
  @Roles([ROLES.USER])
  @Delete('cancel/emergency')
  async cancelEmergencyMessage(@User() user: UserEntity) {
    await this.messageService.removeJobsByUserId(user.id);

    return { success: true };
  }
}
