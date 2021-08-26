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
import { TriggerTimeSlotService } from '../service/trigger-time-slot.service';
import { User } from '../../authentication/decorator/user.decorator';
import { UserEntity, ROLES } from '../../user/entity/user.entity';
import { TimeSlotRO } from '../response/time-slot.ro';
import { AuthGuard } from '@nestjs/passport';
import { ErrorMessageRO } from '../../common/response/error.ro';
import { timeSlotsMapper } from '../mapper/time-slots.mapper';

@ApiBearerAuth()
@UseGuards(new RolesGuard(new Reflector()))
@UseGuards(AuthGuard('cognito'))
@ApiTags('time-slot')
@Controller()
export class GetListOfTimeSlotsController {
  constructor(
    private readonly triggerTimeSlotService: TriggerTimeSlotService
  ) {}

  @ApiResponse({ status: 200, type: TimeSlotRO, isArray: true })
  @ApiResponse({ status: 400, type: ErrorMessageRO })
  @ApiOperation({ summary: 'Get list of time slots by user' })
  @Roles([ROLES.USER])
  @Get('time-slot')
  async getListOfTimeSlots(@User() user: UserEntity) {
    const timeSlots = await this.triggerTimeSlotService.findByUserIdOrFail(
      user.id
    );

    return timeSlotsMapper(timeSlots);
  }
}
