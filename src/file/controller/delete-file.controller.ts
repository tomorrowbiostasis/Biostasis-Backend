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
import { FileService } from '../service/file.service';
import { User } from '../../authentication/decorator/user.decorator';
import { UserEntity, ROLES } from '../../user/entity/user.entity';
import { SuccessRO } from '../../common/response/success.ro';
import { AuthGuard } from '@nestjs/passport';
import { NumericIdValidationPipe } from '../../common/pipe/numeric-id-validation.pipe';
import { ErrorMessageRO } from '../../common/response/error.ro';

@ApiBearerAuth()
@UseGuards(new RolesGuard(new Reflector()))
@UseGuards(AuthGuard('cognito'))
@ApiTags('file')
@Controller('file')
export class DeleteContactController {
  constructor(private readonly fileService: FileService) {}

  @ApiResponse({ status: 200, type: SuccessRO })
  @ApiResponse({ status: 400, type: ErrorMessageRO })
  @ApiOperation({ summary: 'Delete file by user' })
  @Roles([ROLES.USER])
  @Delete(':id')
  async deleteFile(
    @User() user: UserEntity,
    @Param('id', new NumericIdValidationPipe()) fileId: number
  ) {
    const file = await this.fileService.findByIdAndUserIdOrFail(
      fileId,
      user.id
    );

    const result = await this.fileService.deleteFile(file);

    return plainToClass(SuccessRO, { success: !!result?.affected });
  }
}
