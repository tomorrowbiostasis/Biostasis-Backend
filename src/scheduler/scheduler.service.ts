import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, NestSchedule } from 'nest-schedule';
import { PositiveInfoRepository } from '../user/repository/positive-info.repository';

@Injectable()
export class SchedulerService extends NestSchedule {
  private readonly logger = new Logger(SchedulerService.name);
  constructor(
    @Inject(PositiveInfoRepository)
    private readonly positiveInfoRepository: PositiveInfoRepository
  ) {
    super();
  }

  @Cron('* */5 * * * *')
  async checkPositiveInfo() {
    const expiredInformation =
      await this.positiveInfoRepository.findExpiredInformation();

    for (const information of expiredInformation) {
      // TODO: https://concisesoftware.atlassian.net/browse/BB-78
    }
  }
}
