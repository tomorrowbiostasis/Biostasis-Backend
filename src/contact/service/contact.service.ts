import { Inject, Injectable } from '@nestjs/common';
import { ContactRepository } from '../repository/contact.repository';
import { ContactEntity } from '../entity/contact.entity';
import { AddContactDTO } from '../request/dto/add-contact.dto';

@Injectable()
export class ContactService {
  constructor(
    @Inject(ContactRepository)
    private readonly userRepository: ContactRepository
  ) {}

  async findContactsByUserId(userId: string) {
    return this.userRepository.find({ userId });
  }

  async saveContact(
    userId: string,
    data: AddContactDTO
  ): Promise<ContactEntity> {
    return this.userRepository.save({
      ...data,
      userId,
    });
  }
}
