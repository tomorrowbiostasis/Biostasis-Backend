import {
  Inject,
  Injectable,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { UpdateResult, DeleteResult } from 'typeorm';
import { ContactRepository } from '../repository/contact.repository';
import { ContactEntity } from '../entity/contact.entity';
import { AddContactDTO } from '../request/dto/add-contact.dto';
import { UpdateContactDTO } from '../request/dto/update-contact.dto';
import {
  CONTACT_NOT_FOUND,
  VALIDATION_FAILED,
  SAVE_CONTACT_FAILED,
  DELETE_CONTACT_FAILED,
  UPDATE_CONTACT_FAILED,
} from '../../common/error/keys';

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);

  constructor(
    @Inject(ContactRepository)
    private readonly contactRepository: ContactRepository
  ) {}

  async findContactsByUserId(userId: string) {
    return this.contactRepository.findManyByParams({ userId });
  }

  async findActiveContactsByUserId(userId: string) {
    const contacts = await this.findContactsByUserId(userId);

    return contacts.filter((contact) => contact.active);
  }

  async findByIdAndUserIdOrFail(
    id: number,
    userId: string
  ): Promise<ContactEntity> {
    return this.contactRepository
      .findOneByParams({
        id,
        userId,
      })
      .then((data) => {
        if (!data) {
          throw new BadRequestException(CONTACT_NOT_FOUND);
        }

        return data;
      });
  }

  async findById(id: number) {
    return this.contactRepository.findOneByParams({ id });
  }

  async deleteContact(contactId: number): Promise<DeleteResult> {
    return this.contactRepository.delete(contactId).catch((error) => {
      this.logger.error(error);
      throw new BadRequestException(DELETE_CONTACT_FAILED);
    });
  }

  async saveContact(
    userId: string,
    data: AddContactDTO
  ): Promise<ContactEntity> {
    return this.contactRepository
      .save({
        ...data,
        userId,
      })
      .catch((error) => {
        this.logger.error(error);
        throw new BadRequestException(SAVE_CONTACT_FAILED);
      });
  }

  async updateContact(
    contact: ContactEntity,
    data: UpdateContactDTO
  ): Promise<UpdateResult> {
    if (
      !(
        (data.email === undefined && data.phone === undefined) ||
        data.email ||
        data.phone
      )
    ) {
      throw new BadRequestException(VALIDATION_FAILED);
    }

    return this.contactRepository
      .update(
        {
          id: contact.id,
        },
        { ...data }
      )
      .catch((error) => {
        this.logger.error(error);
        throw new BadRequestException(UPDATE_CONTACT_FAILED);
      });
  }
}
