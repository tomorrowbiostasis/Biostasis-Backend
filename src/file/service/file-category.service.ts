import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import {
  FILE_CATEGORY_NOT_FOUND,
  GET_FILE_CATEGORIES_FAILED,
} from '../../common/error/keys';
import { FileCategoryEntity } from '../entity/file-category.entity';
import { FileCategoryRepository } from '../repository/file-category.repository';

@Injectable()
export class FileCategoryService {
  constructor(
    private readonly fileCategoryRepository: FileCategoryRepository
  ) {}

  async findAll(): Promise<FileCategoryEntity[]> {
    return this.fileCategoryRepository.findManyByParams({
      order: { id: 'ASC' },
    });
  }

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
