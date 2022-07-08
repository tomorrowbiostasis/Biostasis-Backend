import { plainToClass } from 'class-transformer';
import { FileCategoryEntity } from '../entity/file-category.entity';
import { FileEntity } from '../entity/file.entity';
import { CategoryRO } from '../response/category.ro';
import { FileRO } from '../response/file.ro';

export const filesMapper = (
  categories: FileCategoryEntity[],
  files: (FileEntity & { url: string })[]
): CategoryRO[] =>
  categories.map((category) =>
    plainToClass(CategoryRO, {
      ...category,
      files: files
        .filter((file) => file.categoryId === category.id)
        .map((file) => plainToClass(FileRO, file)),
    })
  );
