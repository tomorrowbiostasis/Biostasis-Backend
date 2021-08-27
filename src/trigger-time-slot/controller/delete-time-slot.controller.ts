import { Controller, Delete, UseGuards, Param } from '@nestjs/common';
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
import { SuccessRO } from '../../common/response/success.ro';
import { AuthGuard } from '@nestjs/passport';
import { NumericIdValidationPipe } from '../../common/pipe/numeric-id-validation.pipe';
import { ErrorMessageRO } from '../../common/response/error.ro';

@ApiBearerAuth()
@UseGuards(new RolesGuard(new Reflector()))
@UseGuards(AuthGuard('cognito'))
@ApiTags('time-slot')
@Controller('time-slot')
export class DeleteTimeSlotController {
  constructor(private readonly timeSlotService: TriggerTimeSlotService) {}

  @ApiResponse({ status: 200, type: SuccessRO })
  @ApiResponse({ status: 400, type: ErrorMessageRO })
  @ApiOperation({ summary: 'Delete time slot by user' })
  @Roles([ROLES.USER])
  @Delete(':id')
  async deleteTimeSlot(
    @User() user: UserEntity,
    @Param('id', new NumericIdValidationPipe()) timeSlotId: number
  ) {
    const contact = await this.timeSlotService.findByIdAndUserIdOrFail(
      timeSlotId,
      user.id
    );

    const result = await this.timeSlotService.deleteTimeSlot(contact.id);

    return plainToClass(SuccessRO, { success: !!result?.affected });
  }
}
