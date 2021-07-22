import { Inject, Injectable, BadRequestException } from '@nestjs/common';
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
import { CustomError } from '../../common/error/custom-error';

@Injectable()
export class ContactService {
  constructor(
    @Inject(ContactRepository)
    private readonly contactRepository: ContactRepository
  ) {}

  async findContactsByUserId(userId: string) {
    return this.contactRepository.findManyByParams({ userId });
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
      throw new CustomError(DELETE_CONTACT_FAILED, error);
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
        throw new CustomError(SAVE_CONTACT_FAILED, error);
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
        throw new CustomError(UPDATE_CONTACT_FAILED, error);
      });
  }
}
