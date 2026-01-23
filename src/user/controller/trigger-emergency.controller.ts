import {
    Controller,
    Post,
    UseGuards,
    Inject,
    Logger
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
import { plainToClass } from "class-transformer";
import { UserService } from "../service/user.service";
import { ProfileRepository } from '../repository/profile.repository';
import { NotificationService } from "../../notification/service/notification.service";
import { TriggerTimeSlotService } from "../../trigger-time-slot/service/trigger-time-slot.service";
import { getNameOrEmail } from "../../common/helper/get-name-or-email";
// import { DICTIONARY } from "src/common/constant/dictionary.constant";
import { ConfigService } from "@nestjs/config";
import { SchedulerService } from "../../scheduler/scheduler.service";

@ApiBearerAuth()
@ApiTags("user")
@Controller("user")
@UseGuards(AuthGuard("cognito"), RolesGuard) // ✅ correct order
export class TriggerEmergencyController {
    private readonly logger = new Logger("TriggerEmergencyController");
    constructor(
        private readonly config: ConfigService,
        private readonly userService: UserService,
        private readonly profileRepository: ProfileRepository,
        private readonly notificationService: NotificationService,
        private readonly schedulerService: SchedulerService,
        private readonly triggerTimeSlotService: TriggerTimeSlotService,

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
        const activeSlot = await this.triggerTimeSlotService.getActiveTimeSlot(user.id);


        // const result = await this.schedulerService.sendPushNotificationForSingleUser(
        //     user.id,
        //     profile.user.deviceId,
        // );

        return {
            success: 'true',
            data: activeSlot,
        };
        // await this.notificationService.sendEmergencyMessage(
        //     {
        //         name: getNameOrEmail(
        //             user.profile?.name,
        //             user.profile?.surname,
        //             user.email
        //         ),
        //         email: user.email,
        //         phone: user.profile?.prefix
        //             ? `${user.profile?.prefix}${user.profile?.phone}`
        //             : null,
        //     },
        //     user,
        //     { locationUrl: user?.profile?.location }
        // );

        // // return plainToClass(SuccessRO, {
        // //     success: true,
        // //     data: user,
        // // });
        // const firebaseSms = this.config.get<string>('firebase.sms');
        // const backendUrl = this.config.get<string>('backend.url');

        // this.logger.log('Config check:', {
        //     firebaseSms,
        //     backendUrl,
        // });
        // this.notificationService.sendSms({
        //     data: this.notificationService.prepareSmsData(
        //         `${user.profile.prefix}${user.profile.phone}`,
        //         this.config
        //             .get("firebase.sms")
        //             .replace("{domain}", this.config.get("backend.url"))
        //     ),
        //     isPositiveInfoQuestion: false,
        //     userId: user.id,
        //     // isFromQueue: true,
        // });
        // // }
        // return {
        //     success: true,
        //     data: { user, profile }
        // };

    }
}

