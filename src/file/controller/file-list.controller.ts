import { Controller, Get, UseGuards } from '@nestjs/common';
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
import { CategoryRO } from '../response/category.ro';
import { AuthGuard } from '@nestjs/passport';
import { ErrorMessageRO } from '../../common/response/error.ro';
import { FileCategoryService } from '../service/file-category.service';
import { filesMapper } from '../mapper/files.mapper';

@ApiBearerAuth()
@UseGuards(new RolesGuard(new Reflector()))
@UseGuards(AuthGuard('cognito'))
@ApiTags('file')
@Controller('file')
export class FileListController {
  constructor(
    private readonly fileService: FileService,
    private readonly fileCategoryService: FileCategoryService
  ) {}

  @ApiResponse({ status: 200, type: CategoryRO, isArray: true })
  @ApiResponse({ status: 400, type: ErrorMessageRO })
  @ApiOperation({ summary: 'Get file list' })
  @Roles([ROLES.USER])
  @Get()
  async getFileList(@User() user: UserEntity) {
    const [categories, files] = await Promise.all([
      this.fileCategoryService.findAll(),
      this.fileService.findFilesByUserId(user.id),
    ]);

    return filesMapper(
      categories,
      files.map((file) => ({
        ...file,
        url: this.fileService.getFileURL(file.key),
      }))
    );
  }
}
