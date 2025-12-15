import {
    Controller,
    Post,
    Body,
    Logger,
    UnauthorizedException,
} from "@nestjs/common";
import {
    ApiTags,
    ApiResponse,
    ApiOperation,
} from "@nestjs/swagger";
import { plainToClass } from "class-transformer";
import { SuccessRO } from "../../common/response/success.ro";
import { ErrorMessageRO } from "../../common/response/error.ro";
import { UserService } from "../service/user.service";
import { AuthenticationService } from "../../authentication/service/authentication.service";
import { ValidationPipe } from "../../common/pipe/validation.pipe";
import { TriggerEmergencyDTO } from "../request/dto/trigger-emergency.dto";
import { triggerEmergencySchema } from "../request/schema/trigger-emergency.schema";

@ApiTags("user")
@Controller("user")
export class TriggerEmergencyController {
    constructor(
        private readonly authenticationService: AuthenticationService,
        private readonly userService: UserService,
    ) { }

    @ApiResponse({ status: 201, type: SuccessRO })
    @ApiResponse({ status: 400, type: ErrorMessageRO })
    @ApiResponse({ status: 401, type: ErrorMessageRO })
    @ApiOperation({ summary: "Trigger emergency by token" })
    @Post("trigger-emergency")
    async triggerEmergency(
        @Body(new ValidationPipe(triggerEmergencySchema))
        data: TriggerEmergencyDTO
    ) {
        try {
            // Validate and decode the token
            const decodedToken: any = await this.authenticationService.authenticate(
                data.token
            );

            if (!decodedToken || !decodedToken.sub) {
                throw new UnauthorizedException("Invalid token");
            }

            // Get user attributes from Cognito
            const userAttributes = await this.authenticationService.getUserAttributes(
                decodedToken.sub
            );

            if (!userAttributes || !userAttributes.email) {
                throw new UnauthorizedException("User not found");
            }

            // Get user from database
            const user = await this.userService.findByEmail(userAttributes.email);

            if (!user) {
                throw new UnauthorizedException("User not found in database");
            }

            Logger.log(
                `Trigger emergency API called at ${new Date().toISOString()} by user ${user.id}`
            );

            // TODO: Add emergency creation logic here
            // This is where you'll add the emergency creation logic later

            return plainToClass(SuccessRO, { success: true });
        } catch (error) {
            Logger.error(
                `Error in trigger-emergency: ${error.message}`,
                error.stack
            );
            throw error;
        }
    }
}