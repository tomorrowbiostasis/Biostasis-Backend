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
import { UserService } from '../service/user.service';
import { User } from '../../authentication/decorator/user.decorator';
import { UserEntity, ROLES } from '../../user/entity/user.entity';
import { SuccessRO } from '../../common/response/success.ro';
import { AuthGuard } from '@nestjs/passport';
import { NumericIdValidationPipe } from '../../common/pipe/numeric-id-validation.pipe';
import { ErrorMessageRO } from '../../common/response/error.ro';

@ApiBearerAuth()
@UseGuards(new RolesGuard(new Reflector()))
@UseGuards(AuthGuard('cognito'))
@ApiTags('user')
@Controller('user')
export class DeleteUserController {
  constructor(private readonly userService: UserService) {}

  @ApiResponse({ status: 200, type: SuccessRO })
  @ApiResponse({ status: 400, type: ErrorMessageRO })
  @ApiOperation({ summary: 'Delete account by owner' })
  @Roles([ROLES.USER])
  @Delete()
  async deleteAccount(@User() user: UserEntity) {
    const result = await this.userService.deleteUser(user);

    return plainToClass(SuccessRO, { success: !!result?.affected });
  }
}
