// import {
//     Controller,
//     Post,
//     UseGuards,
// } from '@nestjs/common';
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
