import {
  Controller,
  Post,
  Body,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiResponse,
  ApiOperation,
  ApiBody,
  ApiConsumes,
} from '@nestjs/swagger';
import { RolesGuard } from '../../authentication/roles.guard';
import { Roles } from '../../authentication/decorator/roles.decorator';
import { Reflector } from '@nestjs/core';
import { FileService } from '../service/file.service';
import { User } from '../../authentication/decorator/user.decorator';
import { UserEntity, ROLES } from '../../user/entity/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { ErrorMessageRO } from '../../common/response/error.ro';
import { FileInterceptor } from '@nestjs/platform-express';
import { AddFileDTO } from '../request/dto/add-file.dto';
import { addFileSchema } from '../request/schema/add-file.schema';
import { ValidationPipe } from '../../common/pipe/validation.pipe';
import { CATEGORY } from '../enum/category.enum';
import { FileCategoryService } from '../service/file-category.service';
import { plainToClass } from 'class-transformer';
import { FileIdRO } from '../response/file-id.ro';
import { LIMIT_OF_NUMBER_OF_FILES_REACHED } from '../../common/error/keys';

@ApiBearerAuth()
@UseGuards(new RolesGuard(new Reflector()))
@UseGuards(AuthGuard('cognito'))
@ApiTags('file')
@Controller('file')
export class UploadFileController {
  constructor(
    private readonly fileService: FileService,
    private readonly fileCategoryService: FileCategoryService
  ) {}

  @ApiResponse({ status: 400, type: ErrorMessageRO })
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload file by user' })
  @Roles([ROLES.USER])
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        category: {
          enum: Object.values(CATEGORY),
          format: 'text',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  @Post()
  async uploadFile(
    @User() user: UserEntity,
    @Body(new ValidationPipe(addFileSchema))
    data: AddFileDTO,
    @UploadedFile() fileDetails
  ) {
    const category = await this.fileCategoryService.findByCodeOrFail(
      data.category
    );
    const files = await this.fileService.findByCategoryCodeAndUserId(
      [category.code],
      user.id
    );

    if (files.length >= category.limit) {
      throw new BadRequestException(LIMIT_OF_NUMBER_OF_FILES_REACHED);
    }

    const s3File = await this.fileService.uploadFileOrFail(fileDetails);
    const fileEntity = await this.fileService.saveFile(
      user.id,
      fileDetails,
      s3File.Key,
      category.id
    );

    return plainToClass(FileIdRO, fileEntity);
  }
}
