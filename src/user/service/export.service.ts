import { Inject, Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as uuid from 'uuid';
import * as moment from 'moment';
import { UserRepository } from '../repository/user.repository';
import { ProfileRepository } from '../repository/profile.repository';
import { omit } from '../../common/helper/omit';
import { ContactService } from '../../contact/service/contact.service';
import { UserEntity } from '../entity/user.entity';
import { ProfileEntity } from '../entity/profile.entity';
import { ContactRepository } from '../../contact/repository/contact.repository';
import { ContactEntity } from '../../contact/entity/contact.entity';
import { TimeSlotRepository } from '../../trigger-time-slot/repository/time-slot.repository';
import { TimeSlotEntity } from '../../trigger-time-slot/entity/time-slot.entity';
import { getEnumKeyByValue } from '../../common/helper/get-enum-key-by-value';
import { DAYS_OF_WEEKS } from '../../trigger-time-slot/enum/days-of-week.enum';
import { UnconfirmedEmailRepository } from '../../user/repository/unconfirmed-email.repository';
import { UnconfirmedEmailEntity } from '../entity/unconfirmed_email.entity';
import { FileRepository } from '../../file/repository/file.repository';
import { FileEntity } from '../../file/entity/file.entity';
import { FileService } from '../../file/service/file.service';

@Injectable()
export class ExportService {
  private readonly logger = new Logger(ExportService.name);

  constructor(
    @Inject(ContactRepository)
    private readonly contactRepository: ContactRepository,
    @Inject(UserRepository) private readonly userRepository: UserRepository,
    @Inject(ProfileRepository)
    private readonly profileRepository: ProfileRepository,
    @Inject(TimeSlotRepository)
    private readonly timeSlotRepository: TimeSlotRepository,
    private readonly contactService: ContactService,
    @Inject(UnconfirmedEmailRepository)
    private readonly unconfirmedEmailRepository: UnconfirmedEmailRepository,
    @Inject(FileRepository)
    private readonly fileRepository: FileRepository,
    private readonly fileService: FileService
  ) {}

  prepareUserToExport(
    user: UserEntity,
    data: Record<string, unknown>[]
  ): Record<string, unknown>[] {
    const useKeys = {};
    const tableName = this.userRepository.metadata.tableName;

    Object.keys(omit(user, ['id', 'role', 'profile'])).forEach(
      (key, index) => (useKeys[index] = `${key} [${tableName}]`)
    );

    data.push(useKeys);
    data.push(
      omit(
        {
          ...user,
          updatedAt: moment(user.updatedAt).toISOString(),
          createdAt: moment(user.createdAt).toISOString(),
        },
        ['id', 'role', 'profile']
      )
    );
    data.push({});

    return data;
  }

  prepareProfileToExport(
    profile: ProfileEntity,
    data: Record<string, unknown>[]
  ): Record<string, unknown>[] {
    const profileKeys = {};
    const tableName = this.profileRepository.metadata.tableName;

    Object.keys(omit(profile, ['id', 'userId'])).forEach(
      (key, index) => (profileKeys[index] = `${key} [${tableName}]`)
    );

    data.push(profileKeys);
    data.push(
      omit(
        {
          ...profile,
          updatedAt: moment(profile.updatedAt).toISOString(),
          createdAt: moment(profile.createdAt).toISOString(),
          regularNotificationTime: moment(
            profile.regularNotificationTime
          ).toISOString(),
        },
        ['id', 'userId']
      )
    );
    data.push({});

    return data;
  }

  prepareContactsToExport(
    contacts: ContactEntity[],
    data: Record<string, unknown>[]
  ): Record<string, unknown>[] {
    const contactKeys = {};
    const tableName = this.contactRepository.metadata.tableName;

    Object.keys(omit(contacts[0], ['id', 'userId'])).forEach(
      (key, index) => (contactKeys[index] = `${key} [${tableName}]`)
    );
    data.push(contactKeys);

    for (const contact of contacts) {
      data.push(
        omit(
          {
            ...contact,
            updatedAt: moment(contact.updatedAt).toISOString(),
            createdAt: moment(contact.createdAt).toISOString(),
          },
          ['id', 'userId']
        )
      );
    }

    data.push({});

    return data;
  }

  prepareTimeSlotsToExport(
    timeSlots: TimeSlotEntity[],
    data: Record<string, unknown>[]
  ): Record<string, unknown>[] {
    let timeSlotKeys = {};
    const tableName = this.timeSlotRepository.metadata.tableName;

    Object.keys(omit(timeSlots[0], ['id', 'userId'])).forEach(
      (key, index) => (timeSlotKeys[index] = `${key} [${tableName}]`)
    );

    data.push(timeSlotKeys);

    for (const timeSlot of timeSlots) {
      data.push(
        omit(
          {
            ...timeSlot,
            from: timeSlot.from ? moment(timeSlot.from).toISOString() : null,
            to: moment(timeSlot.from).toISOString(),
            days: timeSlot.days
              .map((item) => getEnumKeyByValue(DAYS_OF_WEEKS, item.day))
              .join(', '),
            createdAt: moment(timeSlot.createdAt).toISOString(),
          },
          ['id', 'userId']
        )
      );
    }

    data.push({});

    return data;
  }

  prepareUnconfirmedEmailsToExport(
    unconfirmedEmails: UnconfirmedEmailEntity[],
    data: Record<string, unknown>[]
  ): Record<string, unknown>[] {
    const unconfirmedEmailKeys = {};
    const tableName = this.unconfirmedEmailRepository.metadata.tableName;

    Object.keys(omit(unconfirmedEmails[0], ['id', 'userId', 'code'])).forEach(
      (key, index) => (unconfirmedEmailKeys[index] = `${key} [${tableName}]`)
    );
    data.push(unconfirmedEmailKeys);

    for (const unconfirmedEmail of unconfirmedEmails) {
      data.push(
        omit(
          {
            ...unconfirmedEmail,
            createdAt: moment(unconfirmedEmail.createdAt).toISOString(),
          },
          ['id', 'userId', 'code']
        )
      );
    }

    data.push({});

    return data;
  }

  prepareFilesToExport(
    files: FileEntity[],
    data: Record<string, unknown>[]
  ): Record<string, unknown>[] {
    const fileKeys = {};
    const tableName = this.fileRepository.metadata.tableName;

    Object.keys(omit(files[0], ['id', 'userId', 'categoryId'])).forEach(
      (key, index) => (fileKeys[index] = `${key} [${tableName}]`)
    );
    data.push(fileKeys);

    for (const file of files) {
      data.push(
        omit(
          {
            ...file,
            category: file.category.code,
            url: this.fileService.getFileURL(file.key),
            createdAt: moment(file.createdAt).toISOString(),
          },
          ['id', 'userId', 'categoryId']
        )
      );
    }

    data.push({});

    return data;
  }

  async exportDataAsBase64(userId: string): Promise<string> {
    const filePath = `storage/${uuid.v4()}.xls`;
    const [user, contacts, timeSlots, unconfirmedEmails, files] =
      await Promise.all([
        this.userRepository.findById(userId),
        this.contactService.findContactsByUserId(userId),
        this.timeSlotRepository.findByUserId(userId),
        this.unconfirmedEmailRepository.findByUserId(userId),
        this.fileRepository.findManyByParams({
          where: { userId },
          relations: ['category'],
        }),
      ]);

    let dataAsString = '';
    let dataAsArray = [];

    dataAsArray = this.prepareUserToExport(user, dataAsArray);

    if (user.profile) {
      dataAsArray = this.prepareProfileToExport(user.profile, dataAsArray);
    }

    if (unconfirmedEmails.length > 0) {
      dataAsArray = this.prepareUnconfirmedEmailsToExport(
        unconfirmedEmails,
        dataAsArray
      );
    }

    if (contacts.length > 0) {
      dataAsArray = this.prepareContactsToExport(contacts, dataAsArray);
    }

    if (timeSlots.length > 0) {
      dataAsArray = this.prepareTimeSlotsToExport(timeSlots, dataAsArray);
    }

    if (files.length > 0) {
      dataAsArray = this.prepareFilesToExport(files, dataAsArray);
    }

    Object.values(dataAsArray).forEach((item) => {
      dataAsString += `${Object.values(item).join('\t')}\n`;
    });

    let base64content: string;

    try {
      fs.appendFileSync(filePath, dataAsString);

      base64content = fs.readFileSync(path.resolve(filePath), {
        encoding: 'base64',
      });

      fs.unlinkSync(path.resolve(filePath));

      return base64content;
    } catch (error) {
      this.logger.error(error);
    }
  }
}
