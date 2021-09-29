import { Controller, Post, UseGuards, Body } from '@nestjs/common';
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

@ApiBearerAuth()
@UseGuards(new RolesGuard(new Reflector()))
@UseGuards(AuthGuard('cognito'))
@ApiTags('user')
@Controller('user')
export class NotePositiveInfoController {
  constructor(private readonly positiveInfoService: PositiveInfoService) {}

  @ApiResponse({ status: 200, type: SuccessRO })
  @ApiOperation({ summary: 'Take note of positive information' })
  @Roles([ROLES.USER])
  @Post('/positive-info')
  async notePositiveInfo(
    @User() user: UserEntity,
    @Body(new ValidationPipe(notePositiveInfoSchema))
    data: NotePositiveInfoDTO
  ) {
    const positiveInfo = await this.positiveInfoService.savePositiveInfo(
      user.id,
      data.minutesToNext
    );

    return plainToClass(SuccessRO, { success: !!positiveInfo.id });
  }
}
