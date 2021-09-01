import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import { FILE_CATEGORY_NOT_FOUND } from '../../common/error/keys';
import { FileCategoryEntity } from '../entity/file-category.entity';
import { FileCategoryRepository } from '../repository/file-category.repository';

@Injectable()
export class FileCategoryService {
  constructor(
    private readonly fileCategoryRepository: FileCategoryRepository
  ) {}

  async findByCodeOrFail(code: string): Promise<FileCategoryEntity> {
    return this.fileCategoryRepository
      .findOneByParams({
        code,
      })
      .then((data) => {
        if (!data) {
          throw new BadRequestException(FILE_CATEGORY_NOT_FOUND);
        }

        return data;
      });
  }
}
