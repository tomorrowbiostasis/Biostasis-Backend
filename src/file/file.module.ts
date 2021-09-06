import { Module } from '@nestjs/common';
import { FileService } from './service/file.service';
import { ConfigProvider } from '../common/provider/config.provider';
import { UploadFileController } from './controller/upload-file.controller';
import { AWSS3Provider } from './provider/aws-s3.provider';
import { AWSCloudFrontSignerProvider } from './provider/aws-cloud-front-sign.provider';
import { FileRepositoryProvider } from './provider/file-repository.provider';
import { FileCategoryRepositoryProvider } from './provider/file-category-repository.provider';
import { FileCategoryService } from './service/file-category.service';
import { DeleteContactController } from './controller/delete-file.controller';
import { FileListController } from './controller/file-list.controller';

@Module({
  controllers: [
    UploadFileController,
    DeleteContactController,
    FileListController,
  ],
  providers: [
    FileService,
    ConfigProvider,
    AWSS3Provider,
    AWSCloudFrontSignerProvider,
    FileRepositoryProvider,
    FileCategoryRepositoryProvider,
    FileCategoryService,
  ],
  exports: [FileService, FileCategoryService],
})
export class FileModule {}
