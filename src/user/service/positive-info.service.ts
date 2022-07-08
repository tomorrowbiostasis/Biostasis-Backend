import {
  Inject,
  Injectable,
  Logger,
  BadRequestException,
} from "@nestjs/common";
import { PositiveInfoRepository } from "../repository/positive-info.repository";
import { PositiveInfoEntity } from "../entity/positive-info.entity";
import { SAVE_POSITIVE_INFO_FAILED } from "../../common/error/keys";
import { NotePositiveInfoDTO } from "../request/dto/note-positive-info.dto";
import { TriggerTimeSlotService } from "../../trigger-time-slot/service/trigger-time-slot.service";

@Injectable()
export class PositiveInfoService {
  private readonly logger = new Logger(PositiveInfoService.name);

  constructor(
    @Inject(PositiveInfoRepository)
    private readonly positiveInfoRepository: PositiveInfoRepository,
    private readonly triggerTimeSlotService: TriggerTimeSlotService,
  ) { }

  findByUserId(id: string): Promise<{ id: number; now: string }> {
    return this.positiveInfoRepository.findByUserId(id);
  }

  async savePositiveInfo(
    userId: string,
    params: NotePositiveInfoDTO
  ): Promise<PositiveInfoEntity> {
    const positiveInfo = await this.positiveInfoRepository.findByUserId(userId);

    let updatedAt = positiveInfo?.now;

    // const activeSlot = await this.triggerTimeSlotService.getActiveTimeSlot(userId);

    // if (activeSlot) {
    //   updatedAt = activeSlot.to as any;
    // }

    let data: Partial<PositiveInfoEntity> = {
      ...positiveInfo,
      userId,
      updatedAt,
      smsTime: null,
      pushNotificationTime: null,
      alertTime: null,
      triggerTime: null,
    };

    if (params && params?.minutesToNext) {
      data.minutesToNext = params.minutesToNext;
    }

    this.logger.log(`Positive info noticed for ${userId}`);

    return this.positiveInfoRepository.save(data).catch((error) => {
      this.logger.error(error);
      throw new BadRequestException(SAVE_POSITIVE_INFO_FAILED);
    });
  }
}
