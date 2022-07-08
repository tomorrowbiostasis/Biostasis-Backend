import { Test, TestingModule } from '@nestjs/testing';
import { NotePositiveInfoController } from './note-positive-info.controller';
import { PositiveInfoService } from '../service/positive-info.service';
import { positiveInfoServiceMock } from '../../../test/mock/positive-info.service.mock';
import { ProfileService } from '../service//profile.service';
import { profileServiceMock } from '../../../test/mock/profile.service.mock';

describe('Note Positive Info Controller', () => {
  let controller: NotePositiveInfoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotePositiveInfoController],
      providers: [
        {
          provide: PositiveInfoService,
          useValue: positiveInfoServiceMock,
        },
        {
          provide: ProfileService,
          useValue: profileServiceMock,
        },
      ],
    }).compile();

    controller = module.get<NotePositiveInfoController>(
      NotePositiveInfoController
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
