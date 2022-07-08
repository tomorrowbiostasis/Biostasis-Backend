import { ApiProperty } from '@nestjs/swagger';
import { CATEGORY } from '../../enum/category.enum';
import { getEnumKeys } from '../../../common/helper/get-enum-keys';

export class AddFileDTO {
  @ApiProperty({
    type: 'enum',
    required: false,
    isArray: true,
    enum: Object.values(CATEGORY),
    example: CATEGORY.MEDICAL_DIRECTIVE,
  })
  category: string;
}
