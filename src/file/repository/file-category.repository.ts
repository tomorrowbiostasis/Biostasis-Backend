import { EntityRepository, Repository, In } from 'typeorm';
import { FileCategoryEntity } from '../entity/file-category.entity';
import { Logger } from '@nestjs/common';

@EntityRepository(FileCategoryEntity)
export class FileCategoryRepository extends Repository<FileCategoryEntity> {
  protected readonly logger = new Logger(FileCategoryRepository.name);

  findManyByParams(
    params: Record<string, unknown>
  ): Promise<FileCategoryEntity[]> {
    return new Promise((resolve) => {
      this.find(params)
        .then((data) => resolve(data))
        .catch((error) => this.logger.error(error));
    });
  }

  findOneByParams(
    params: Record<string, unknown>
  ): Promise<FileCategoryEntity> {
    return new Promise((resolve) => {
      this.findOne(params)
        .then((data) => resolve(data))
        .catch((error) => this.logger.error(error));
    });
  }
}
