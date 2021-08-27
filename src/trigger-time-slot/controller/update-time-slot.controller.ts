import {
  Controller,
  Patch,
  Body,
  UseGuards,
  Param,
  Inject,
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
import { plainToClass } from 'class-transformer';
import { TriggerTimeSlotService } from '../service/trigger-time-slot.service';
import { User } from '../../authentication/decorator/user.decorator';
import { UserEntity, ROLES } from '../../user/entity/user.entity';
import { TimeSlotRO } from '../response/time-slot.ro';
import { UpdateTimeSlotDTO } from '../request/dto/update-time-slot.dto';
import { updateTimeSlotSchema } from '../request/schema/update-time-slot.schema';
import { ValidationPipe } from '../../common/pipe/validation.pipe';
import { AuthGuard } from '@nestjs/passport';
import { NumericIdValidationPipe } from '../../common/pipe/numeric-id-validation.pipe';
import { ErrorMessageRO } from '../../common/response/error.ro';
import { timeSlotMapper } from '../mapper/time-slot.mapper';

@ApiBearerAuth()
@UseGuards(new RolesGuard(new Reflector()))
@UseGuards(AuthGuard('cognito'))
@ApiTags('time-slot')
@Controller('time-slot')
export class UpdateTimeSlotController {
  constructor(private readonly timeSlotService: TriggerTimeSlotService) {}

  @ApiResponse({ status: 200, type: TimeSlotRO })
  @ApiResponse({ status: 400, type: ErrorMessageRO })
  @ApiOperation({ summary: 'Update time slot by user' })
  @Roles([ROLES.USER])
  @Patch(':id')
  async updateTimeSlot(
    @User() user: UserEntity,
    @Param('id', new NumericIdValidationPipe()) timeSlotId: number,
    @Body(new ValidationPipe(updateTimeSlotSchema))
    data: UpdateTimeSlotDTO
  ) {
    let timeSlot = await this.timeSlotService.findByIdAndUserIdOrFail(
      timeSlotId,
      user.id
    );

    timeSlot = await this.timeSlotService.updateTimeSlot(
      timeSlot,
      user.id,
      data
    );

    return timeSlotMapper(timeSlot);
  }
}
