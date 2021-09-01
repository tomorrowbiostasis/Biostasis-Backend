import {
  Inject,
  Injectable,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { CustomError } from '../../common/error/custom-error';
import UploadResult from '../type/upload-result';
import { DICTIONARY } from '../constant/dictionary.constant';
import { DICTIONARY as COMMON_DI } from '../../common/constant/dictionary.constant';
import * as AWS from 'aws-sdk';
import * as configLib from 'config';
import * as uuid from 'uuid';
import File from '../type/file';
import {
  FILE_UPLOAD_FAILED,
  FILE_IS_REQUIRED,
  FILE_TYPE_IS_INVALID,
  FILE_IS_TOO_BIG,
  SAVE_FILE_FAILED,
} from '../../common/error/keys';
import { FileEntity } from '../entity/file.entity';
import { FileRepository } from '../repository/file.repository';

@Injectable()
export class FileService {
  private readonly logger = new Logger(FileService.name);

  constructor(
    @Inject(DICTIONARY.S3) private readonly s3: AWS.S3,
    @Inject(COMMON_DI.CONFIG) private readonly config: configLib.IConfig,
    @Inject(FileRepository)
    private readonly fileRepository: FileRepository
  ) {}

  async uploadFileOrFail(file: File): Promise<UploadResult> {
    if (!file) {
      throw new BadRequestException(FILE_IS_REQUIRED);
    }

    if (
      ![
        'image/jpeg',
        'image/jpg',
        'image/png',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ].includes(file.mimetype)
    ) {
      throw new BadRequestException(FILE_TYPE_IS_INVALID);
    }

    if (file.size > Number(this.config.get('s3.fileSizeLimit')) * 1024 * 1024) {
      throw new BadRequestException(FILE_IS_TOO_BIG);
    }

    return this.uploadFile(file).catch((error) => {
      this.logger.error(error);

      throw new CustomError(FILE_UPLOAD_FAILED, error);
    });
  }

  async uploadFile(file: File): Promise<UploadResult> {
    return new Promise((resolve, reject) => {
      this.s3.upload(
        {
          Bucket: this.config.get('s3.bucket'),
          Key: `${uuid.v4()}.${file.originalname.split('.').reverse()[0]}`,
          Body: file.buffer,
          ServerSideEncryption: 'AES256',
        },
        (error, data) => {
          if (!error) {
            resolve(data as UploadResult);
          } else {
            reject(error);
          }
        }
      );
    });
  }

  async saveFile(
    userId: string,
    file: File,
    key: string,
    categoryId: number
  ): Promise<FileEntity> {
    return this.fileRepository
      .save({
        userId,
        categoryId,
        key,
        name: file.originalname.replace(/ /g, '_'),
        size: file.size,
        mimeType: file.mimetype,
      })
      .catch((error) => {
        throw new CustomError(SAVE_FILE_FAILED, error);
      });
  }
}
