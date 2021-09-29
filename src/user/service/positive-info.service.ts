import {
  Inject,
  Injectable,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { PositiveInfoRepository } from '../repository/positive-info.repository';
import { PositiveInfoEntity } from '../entity/positive-info.entity';
import { SAVE_POSITIVE_INFO_FAILED } from '../../common/error/keys';

@Injectable()
export class PositiveInfoService {
  private readonly logger = new Logger(PositiveInfoService.name);

  constructor(
    @Inject(PositiveInfoRepository)
    private readonly positiveInfoRepository: PositiveInfoRepository
  ) {}

  findByUserId(id: string): Promise<{ id: number; now: string }> {
    return this.positiveInfoRepository.findByUserId(id);
  }

  async savePositiveInfo(
    userId: string,
    minutesToNext: number
  ): Promise<PositiveInfoEntity> {
    const positiveInfo = await this.positiveInfoRepository.findByUserId(userId);

    return this.positiveInfoRepository
      .save({
        ...positiveInfo,
        userId,
        minutesToNext,
        updatedAt: positiveInfo?.now,
      })
      .catch((error) => {
        this.logger.error(error);
        throw new BadRequestException(SAVE_POSITIVE_INFO_FAILED);
      });
  }
}
