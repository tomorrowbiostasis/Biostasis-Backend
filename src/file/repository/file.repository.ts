import { EntityRepository, Repository } from 'typeorm';
import { Logger } from '@nestjs/common';
import { FileEntity } from '../entity/file.entity';

@EntityRepository(FileEntity)
export class FileRepository extends Repository<FileEntity> {
  private readonly logger = new Logger(FileRepository.name);

  findManyByParams(params: Record<string, unknown>): Promise<FileEntity[]> {
    return new Promise((resolve) => {
      this.find(params)
        .then((data) => resolve(data))
        .catch((error) => this.logger.error(error));
    });
  }

  findOneByParams(params: Record<string, unknown>): Promise<FileEntity> {
    return new Promise((resolve) => {
      this.findOne(params)
        .then((data) => resolve(data))
        .catch((error) => this.logger.error(error));
    });
  }

  findByCategoryCodeAndUserId(
    codes: string[],
    userId: string
  ): Promise<FileEntity[]> {
    return this.createQueryBuilder('file')
      .innerJoin(
        'file_category',
        'category',
        'category.id = file.category_id and category.code IN (:codes)',
        {
          codes,
        }
      )
      .where('file.user_id = :userId', { userId })
      .getMany();
  }
}
