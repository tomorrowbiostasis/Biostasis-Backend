import {
  BadRequestException,
  Controller,
  Post,
  Body,
  UseGuards,
} from "@nestjs/common";
import {
  ApiTags,
  ApiResponse,
  ApiOperation,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { plainToClass } from "class-transformer";
import { RolesGuard } from "../../authentication/roles.guard";
import { Roles } from "../../authentication/decorator/roles.decorator";
import { UserService } from "../service/user.service";
import { User } from "../../authentication/decorator/user.decorator";
import { UserEntity, ROLES } from "../../user/entity/user.entity";
import { ErrorMessageRO } from "../../common/response/error.ro";
import { NotificationService } from "../../notification/service/notification.service";
import { SuccessRO } from "../../common/response/success.ro";
import { getNameOrEmail } from "../../common/helper/get-name-or-email";
import { LOCATION_DATA_IS_NEEDED } from "../../common/error/keys";

@ApiBearerAuth()
@UseGuards(new RolesGuard(new Reflector()))
@UseGuards(AuthGuard("cognito"))
@ApiTags("user")
@Controller("user")
export class SendTestMessageController {
  constructor(
    private readonly userService: UserService,
    private readonly notificationService: NotificationService
  ) {}

  @ApiResponse({ status: 201, type: SuccessRO })
  @ApiResponse({ status: 400, type: ErrorMessageRO })
  @ApiOperation({ summary: "Send test emergency message" })
  @Roles([ROLES.USER])
  @Post("message/test")
  async sendTestEmergencyMessage(@User() user: UserEntity) {
    user = await this.userService.findByIdOrFail(user.id);

    await this.notificationService.sendEmergencyMessage(
      {
        name: getNameOrEmail(
          user.profile?.name,
          user.profile?.surname,
          user.email
        ),
        email: user.email,
        phone: user.profile?.prefix
          ? `${user.profile?.prefix}${user.profile?.phone}`
          : null,
      },
      user,
      { locationUrl: user?.profile?.location }
    );

    return plainToClass(SuccessRO, { success: true });
  }
}
