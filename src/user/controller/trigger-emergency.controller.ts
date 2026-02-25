import {
    Controller,
    Post,
    UseGuards,
    Inject,
    Logger,
    forwardRef,
} from "@nestjs/common";
import {
    ApiTags,
    ApiBearerAuth,
    ApiResponse,
    ApiOperation,
} from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "../../authentication/roles.guard";
import { Roles } from "../../authentication/decorator/roles.decorator";
import { User } from "../../authentication/decorator/user.decorator";
import { UserEntity, ROLES } from "../../user/entity/user.entity";
import { SuccessRO } from "../../common/response/success.ro";
import { UserService } from "../service/user.service";
import { ProfileRepository } from '../repository/profile.repository';
import { NotificationService } from "../../notification/service/notification.service";
import { ConfigService } from "@nestjs/config";
import { SchedulerService } from "../../scheduler/scheduler.service";

@ApiBearerAuth()
@ApiTags("user")
@Controller("user")
@UseGuards(AuthGuard("cognito"), RolesGuard)
export class TriggerEmergencyController {
    private readonly logger = new Logger("TriggerEmergencyController");
    constructor(
        private readonly config: ConfigService,
        private readonly userService: UserService,
        private readonly profileRepository: ProfileRepository,
        private readonly notificationService: NotificationService,
        @Inject(forwardRef(() => SchedulerService))
        private readonly schedulerService: SchedulerService,

    ) { }

    @ApiResponse({ status: 200, type: SuccessRO })
    @ApiOperation({ summary: "Trigger emergency" })
    @Roles([ROLES.USER])
    @Post("trigger-emergency")
    async triggerEmergency(@User() user: UserEntity) {
        user = await this.userService.findByIdOrFail(user.id);
        const profile = await this.profileRepository.findByUserId(user.id);
        if (!profile?.user.deviceId) {
            return {
                success: false,
                message: "No device ID found for user"
            };
        }

        if (!profile.automatedEmergency) {
            return {
                success: false,
                message: "Emergency trigger is disabled for the user"
            }
        }

        const result = await this.schedulerService.sendPushNotificationForSingleUser(
            user.id,
            profile.user.deviceId,
        );

        return {
            success: true,
            data: result,
        };
    }
}

