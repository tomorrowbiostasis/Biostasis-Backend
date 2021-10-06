import {
  Inject,
  Injectable,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { PositiveInfoRepository } from '../repository/positive-info.repository';
import { PositiveInfoEntity } from '../entity/positive-info.entity';
import { SAVE_POSITIVE_INFO_FAILED } from '../../common/error/keys';
import { NotePositiveInfoDTO } from '../request/dto/note-positive-info.dto';

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
    params: NotePositiveInfoDTO
  ): Promise<PositiveInfoEntity> {
    const positiveInfo = await this.positiveInfoRepository.findByUserId(userId);
    let data: Partial<PositiveInfoEntity> = {
      ...positiveInfo,
      userId,
      updatedAt: positiveInfo?.now,
      smsTime: null,
      pushNotificationTime: null,
      triggerTime: null,
    };

    if (params.locationUrl) {
      data.location = params.locationUrl;
    }

    if (params.minutesToNext) {
      data.minutesToNext = params.minutesToNext;
    }

    return this.positiveInfoRepository.save(data).catch((error) => {
      this.logger.error(error);
      throw new BadRequestException(SAVE_POSITIVE_INFO_FAILED);
    });
  }
}
