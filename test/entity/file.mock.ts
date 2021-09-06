import { FileEntity } from '../../src/file/entity/file.entity';
import { getConnection } from 'typeorm';

export const getFileById = async (id: number): Promise<FileEntity> => {
  return getConnection().getRepository(FileEntity).findOne(id);
};

export const getFiles = async (id: number): Promise<FileEntity[]> => {
  return getConnection().getRepository(FileEntity).find();
};
