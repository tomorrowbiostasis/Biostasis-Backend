// import {
//     Controller,
//     Post,
//     // UseGuards,
// } from '@nestjs/common';
// import { UserService } from '../service/user.service';
// import {
//     ApiTags,
//     ApiBearerAuth,
//     ApiResponse,
//     ApiOperation,
// } from '@nestjs/swagger';
// import { RolesGuard } from '../../authentication/roles.guard';
// import { Roles } from '../../authentication/decorator/roles.decorator';
// import { Reflector } from '@nestjs/core';
// import { User } from '../../authentication/decorator/user.decorator';
// import { UserEntity, ROLES } from '../../user/entity/user.entity';
// import { AuthGuard } from '@nestjs/passport';
// import { SuccessRO } from '../../common/response/success.ro';
// import { ProfileService } from '../service/profile.service';
// import { plainToClass } from 'class-transformer';

// @ApiBearerAuth()
// @UseGuards(new RolesGuard(new Reflector()))
// @UseGuards(AuthGuard('cognito'))
// @ApiTags('user')
// @Controller('user')
// export class TriggerEmergencyController {
//     constructor(private readonly profileService: ProfileService) { }

//     @ApiResponse({ status: 200, type: SuccessRO })
//     @ApiOperation({ summary: 'Get user and profile from token' })
//     @Roles([ROLES.USER])
//     @Post('trigger-emergency')
//     async triggerEmergency(@User() user: UserEntity) {
//         // Fetch profile for the user
//         const profile = await this.profileService.findByUserId(user.id);

//         return plainToClass(SuccessRO, {
//             success: true,
//             data: { user, profile },
//         });
//     }
// }

// @Controller('user')
// export class TriggerEmergencyController {
//     constructor(private readonly userService: UserService) { }

//     @Post('trigger-emergency')
//     async triggerEmergency() {
//         const user = await this.userService.findById('test');
//         return { ok: true, user };
//     }
// }
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
import { getNameOrEmail } from "../../common/helper/get-name-or-email";
// import { DICTIONARY } from "src/common/constant/dictionary.constant";
import { ConfigService } from "@nestjs/config";

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
    ) { }

    @ApiResponse({ status: 200, type: SuccessRO })
    @ApiOperation({ summary: "Trigger emergency" })
    @Roles([ROLES.USER])
    @Post("trigger-emergency")
    async triggerEmergency(@User() user: UserEntity) {
        user = await this.userService.findByIdOrFail(user.id);
        const profile = await this.profileRepository.findByUserId(user.id);
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

        // return plainToClass(SuccessRO, {
        //     success: true,
        //     data: user, // ← user came from token
        // });
        const firebaseSms = this.config.get<string>('firebase.sms');
        const backendUrl = this.config.get<string>('backend.url');

        this.logger.log('Config check:', {
            firebaseSms,
            backendUrl,
        });
        this.notificationService.sendSms({
            data: this.notificationService.prepareSmsData(
                `${user.profile.prefix}${user.profile.phone}`,
                this.config
                    .get("firebase.sms")
                    .replace("{domain}", this.config.get("backend.url"))
            ),
            isPositiveInfoQuestion: false,
            userId: user.id,
            // isFromQueue: true,
        });
        // }
        return {
            success: true,
            data: { user, profile }
        };

    }
}

