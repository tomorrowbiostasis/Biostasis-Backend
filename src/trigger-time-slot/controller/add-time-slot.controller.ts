import { Controller, Post, Body, UseGuards } from '@nestjs/common';
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
import { TriggerTimeSlotService } from '../service/trigger-time-slot.service';
import { User } from '../../authentication/decorator/user.decorator';
import { UserEntity, ROLES } from '../../user/entity/user.entity';
import { TimeSlotIdRO } from '../response/time-slot-id.ro';
import { AddTimeSlotDTO } from '../request/dto/add-time-slot.dto';
import { addTimeSlotSchema } from '../request/schema/add-time-slot.schema';
import { ValidationPipe } from '../../common/pipe/validation.pipe';
import { AuthGuard } from '@nestjs/passport';
import { ErrorMessageRO } from '../../common/response/error.ro';
import { TimeSlotEntity } from '../entity/time-slot.entity';

@ApiBearerAuth()
@UseGuards(new RolesGuard(new Reflector()))
@UseGuards(AuthGuard('cognito'))
@ApiTags('time-slot')
@Controller()
export class AddTimeSlotController {
  constructor(
    private readonly triggerTimeSlotService: TriggerTimeSlotService
  ) {}

  @ApiResponse({ status: 201, type: TimeSlotIdRO })
  @ApiResponse({ status: 400, type: ErrorMessageRO })
  @ApiOperation({ summary: 'Add time slot by user' })
  @Roles([ROLES.USER])
  @Post('time-slot')
  async addTimeSlot(
    @User() user: UserEntity,
    @Body(new ValidationPipe(addTimeSlotSchema))
    data: AddTimeSlotDTO
  ) {
    let timeSlot: TimeSlotEntity;

    if (!data.from) {
      timeSlot = await this.triggerTimeSlotService.findByUserIdAndPeriodStart(
        user.id,
        null
      );
    }

    if (!timeSlot) {
      timeSlot = await this.triggerTimeSlotService.saveTimeSlot(user.id, data);
    } else {
      timeSlot = await this.triggerTimeSlotService.updateTimeSlot(
        timeSlot,
        user.id,
        data
      );
    }

    return plainToClass(TimeSlotIdRO, timeSlot);
  }
}
