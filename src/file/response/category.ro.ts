import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { FileRO } from './file.ro';

@Exclude()
export class CategoryRO {
  @Expose()
  @ApiProperty({ type: String })
  code: string;

  @Expose()
  @ApiProperty({ type: FileRO, isArray: true })
  files: FileRO[];
}
