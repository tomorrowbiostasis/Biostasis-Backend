import { FileCategoryEntity } from '../../src/file/entity/file-category.entity';
import { getConnection } from 'typeorm';

export const getCategories = async (): Promise<FileCategoryEntity[]> => {
  return getConnection()
    .getRepository(FileCategoryEntity)
    .find({
      order: {
        id: 'ASC',
      },
    });
};
