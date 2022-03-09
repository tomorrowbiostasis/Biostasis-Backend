import {
  Inject,
  Injectable,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import UploadResult from '../type/upload-result';
import { DICTIONARY } from '../constant/dictionary.constant';
import { DICTIONARY as COMMON_DI } from '../../common/constant/dictionary.constant';
import * as AWS from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import * as uuid from 'uuid';
import * as moment from 'moment';
import File from '../type/file';
import {
  FILE_UPLOAD_FAILED,
  FILE_IS_REQUIRED,
  FILE_TYPE_IS_INVALID,
  FILE_IS_TOO_BIG,
  SAVE_FILE_FAILED,
  FILE_NOT_FOUND,
  DELETE_FILE_FROM_DB_FAILED,
  DELETE_FILE_FROM_S3_FAILED,
  GET_FILE_URL_FAILED,
} from '../../common/error/keys';
import { FileEntity } from '../entity/file.entity';
import { FileRepository } from '../repository/file.repository';
import { DeleteResult } from 'typeorm';

@Injectable()
export class FileService {
  private readonly logger = new Logger(FileService.name);

  constructor(
    @Inject(DICTIONARY.S3) private readonly s3: AWS.S3,
    @Inject(DICTIONARY.CLOUD_FRONT_SIGNER)
    private readonly cloudFrontSigner: AWS.CloudFront.Signer,
    @Inject(COMMON_DI.CONFIG) private readonly config: ConfigService,
    @Inject(FileRepository)
    private readonly fileRepository: FileRepository
  ) {}

  async findFilesByUserId(userId: string) {
    return this.fileRepository.findManyByParams({ userId });
  }

  findByCategoryCodeAndUserId(
    codes: string[],
    userId: string
  ): Promise<FileEntity[]> {
    return this.fileRepository.findByCategoryCodeAndUserId(codes, userId);
  }

  getFileURL(key: string): string {
    try {
      return this.cloudFrontSigner.getSignedUrl({
        url: `${this.config.get('cloudFrontSigner.url')}/${key}`,
        expires: moment()
          .add(this.config.get('cloudFrontSigner.validityTime'), 'hours')
          .unix(),
      });
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(GET_FILE_URL_FAILED);
    }
  }

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
      throw new BadRequestException(FILE_UPLOAD_FAILED);
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

  async getFileAsBase64(key: string): Promise<any> {
    return new Promise((resolve) => {
      this.s3.getObject(
        {
          Bucket: this.config.get('s3.bucket'),
          Key: key,
        },
        (error, data) => {
          if (!error) {
            resolve(data.Body.toString('base64'));
          } else {
            this.logger.error(JSON.stringify(error));
            resolve(null);
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
        this.logger.error(error);
        throw new BadRequestException(SAVE_FILE_FAILED);
      });
  }

  async findByIdAndUserIdOrFail(
    id: number,
    userId: string
  ): Promise<FileEntity> {
    return this.fileRepository
      .findOneByParams({
        id,
        userId,
      })
      .then((data) => {
        if (!data) {
          throw new BadRequestException(FILE_NOT_FOUND);
        }

        return data;
      });
  }

  async deleteFile(file: FileEntity): Promise<DeleteResult> {
    await new Promise((resolve, reject) => {
      this.s3.deleteObject(
        {
          Bucket: this.config.get('s3.bucket'),
          Key: file.key,
        },
        (error, data) => {
          if (!error) {
            resolve(data);
          } else {
            reject(error);
          }
        }
      );
    }).catch((error) => {
      this.logger.error(error);
      throw new BadRequestException(DELETE_FILE_FROM_S3_FAILED);
    });

    return this.fileRepository.delete(file.id).catch((error) => {
      this.logger.error(error);
      throw new BadRequestException(DELETE_FILE_FROM_DB_FAILED);
    });
  }
}
