import {
  Exclude,
  Expose,
  Transform,
  TransformFnParams,
} from 'class-transformer';
import * as moment from 'moment';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class ProfileRO {
  @Expose()
  @ApiProperty({ type: String })
  userId: string;

  @Expose()
  @ApiProperty({ type: String })
  address?: string;

  @Expose()
  @ApiProperty({ type: String })
  name?: string;

  @Expose()
  @ApiProperty({ type: String })
  surname?: string;

  @Expose()
  @ApiProperty({ type: String })
  phone?: string;

  @Expose()
  @ApiProperty({ type: Number })
  prefix?: number;

  @Expose()
  @ApiProperty({ type: String })
  email?: string;

  @Expose()
  @Transform(({ value }: TransformFnParams) =>
    value ? moment(value).format('DD/MM/YYYY') : null
  )
  @ApiProperty({ type: String })
  dateOfBirth?: string;

  @Expose()
  @ApiProperty({ type: String })
  primaryPhisican: string;

  @Expose()
  @ApiProperty({ type: String })
  primaryPhisicanAddress: string;

  @Expose()
  @ApiProperty({ type: Boolean })
  seriousMedicalIssues: boolean;

  @Expose()
  @ApiProperty({ type: String })
  mostRecentDiagnosis: string;

  @Expose()
  @Transform(({ value }: TransformFnParams) =>
    value ? moment(value).format('DD/MM/YYYY') : null
  )
  @ApiProperty({ type: String })
  lastHospitalVisit: string;

  @Expose()
  @ApiProperty({ type: String })
  createdAt: string;

  @Expose()
  @ApiProperty({ type: String })
  updatedAt: string;
}
