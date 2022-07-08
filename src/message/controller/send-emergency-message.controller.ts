import {
  Controller,
  Post,
  Body,
  UseGuards,
  Logger,
} from "@nestjs/common";
import {
  ApiTags,
  ApiBearerAuth,
  ApiResponse,
  ApiOperation,
} from "@nestjs/swagger";
import { RolesGuard } from "../../authentication/roles.guard";
import { Roles } from "../../authentication/decorator/roles.decorator";
import { Reflector } from "@nestjs/core";
import { plainToClass } from "class-transformer";
import { NotificationService } from "../../notification/service/notification.service";
import { User } from "../../authentication/decorator/user.decorator";
import { UserEntity, ROLES } from "../../user/entity/user.entity";
import { SuccessRO } from "../../common/response/success.ro";
import { AuthGuard } from "@nestjs/passport";
import { ErrorMessageRO } from "../../common/response/error.ro";
import { UserService } from "../../user/service/user.service";
import { ContactService } from "../../contact/service/contact.service";
import { ValidationPipe } from "../../common/pipe/validation.pipe";
import { SendEmergencyMessageDTO } from "../request/dto/send-emergency-message.dto";
import { sendEmergencyMessageSchema } from "../request/schema/send-emergency-message.schema";
import { getNameOrEmail } from "../../common/helper/get-name-or-email";

@ApiBearerAuth()
@UseGuards(new RolesGuard(new Reflector()))
@UseGuards(AuthGuard("cognito"))
@ApiTags("message")
@Controller("message")
export class SendEmergencyMessageController {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly userService: UserService,
    private readonly contactService: ContactService,
  ) {}

  @ApiResponse({ status: 201, type: SuccessRO })
  @ApiResponse({ status: 400, type: ErrorMessageRO })
  @ApiOperation({ summary: "Send emergency message" })
  @Roles([ROLES.USER])
  @Post("send/emergency")
  async sendEmergencyMessage(
    @User() user: UserEntity,
    @Body(new ValidationPipe(sendEmergencyMessageSchema))
    data: SendEmergencyMessageDTO
  ) {
    user = await this.userService.findByIdOrFail(user.id);

    const contacts = await this.contactService.findActiveContactsByUserId(
      user.id
    );

    if (contacts.length === 0) {
      return plainToClass(SuccessRO, { success: false });
    }

    const operations = [];

    for (const contact of contacts) {
      operations.push(
        this.notificationService.sendEmergencyMessage(
          {
            name: getNameOrEmail(contact.name, contact.surname, contact.email),
            email: contact.email,
            phone: contact.prefix ? `${contact.prefix}${contact.phone}` : null,
          },
          user,
          { ...data, locationUrl: user.profile.location }
        )
      );
    }

    await Promise.all([
      this.userService.clearPositiveInfo(user.id),
      ...operations
    ]);

    Logger.log(`Processed manually triggered emergency message at ${new Date().toISOString()} by ${user.id}. Number of informed contacts: ${operations.length}`)

    return plainToClass(SuccessRO, { success: true });
  }
}
