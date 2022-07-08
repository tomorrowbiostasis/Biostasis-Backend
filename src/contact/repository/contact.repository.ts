import { EntityRepository, Repository } from 'typeorm';
import { Logger } from '@nestjs/common';
import { ContactEntity } from '../entity/contact.entity';

@EntityRepository(ContactEntity)
export class ContactRepository extends Repository<ContactEntity> {
  protected readonly logger = new Logger(ContactRepository.name);

  findOneByParams(params: Record<string, unknown>): Promise<ContactEntity> {
    return new Promise((resolve) => {
      this.findOne(params)
        .then((data) => resolve(data))
        .catch((error) => this.logger.error(error));
    });
  }

  findManyByParams(params: Record<string, unknown>): Promise<ContactEntity[]> {
    return new Promise((resolve) => {
      this.find(params)
        .then((data) => resolve(data))
        .catch((error) => this.logger.error(error));
    });
  }
}
