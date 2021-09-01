import { EntityRepository, Repository } from 'typeorm';
import { Logger } from '@nestjs/common';
import { FileEntity } from '../entity/file.entity';

@EntityRepository(FileEntity)
export class FileRepository extends Repository<FileEntity> {
  private readonly logger = new Logger(FileRepository.name);

  findOneByParams(params: Record<string, unknown>): Promise<FileEntity> {
    return new Promise((resolve) => {
      this.findOne(params)
        .then((data) => resolve(data))
        .catch((error) => this.logger.error(error));
    });
  }
}
