import { Controller, Patch, Body } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import { Roles } from '../../authentication/decorator/roles.decorator';
import { UserService } from '../service/user.service';
import { ROLES } from '../../user/entity/user.entity';
import { ConfirmUserEmailDTO } from '../request/dto/confirm-user-email.dto';
import { confirmUserEmailSchema } from '../request/schema/confirm-user-email.schema';
import { ValidationPipe } from '../../common/pipe/validation.pipe';
import { ErrorMessageRO } from '../../common/response/error.ro';
import { UnconfirmedEmailService } from '../service/unconfirmed-email.service';
import { SuccessRO } from '../../common/response/success.ro';

@ApiTags('user')
@Controller('user')
export class ConfirmUserEmailController {
  constructor(
    private readonly userService: UserService,
    private readonly unconfirmedEmailService: UnconfirmedEmailService
  ) {}

  @ApiResponse({ status: 200, type: SuccessRO })
  @ApiResponse({ status: 400, type: ErrorMessageRO })
  @ApiOperation({ summary: 'Confirm email by user' })
  @Roles([ROLES.USER])
  @Patch('email/confirm')
  async confirmUserEmail(
    @Body(new ValidationPipe(confirmUserEmailSchema))
    data: ConfirmUserEmailDTO
  ) {
    const unconfirmedEmail =
      await this.unconfirmedEmailService.findByCodeOrFail(data.code);

    await this.unconfirmedEmailService.changeUserEmailInCognito(
      unconfirmedEmail.user,
      unconfirmedEmail.email
    );

    const result = await this.userService.updateUserEmail(
      unconfirmedEmail.user.id,
      unconfirmedEmail.email
    );

    return plainToClass(SuccessRO, { success: !!result.affected });
  }
}
