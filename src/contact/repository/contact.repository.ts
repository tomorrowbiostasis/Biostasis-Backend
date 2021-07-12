import { EntityRepository, Repository } from 'typeorm';
import { ContactEntity } from '../entity/contact.entity';

@EntityRepository(ContactEntity)
export class ContactRepository extends Repository<ContactEntity> {}
