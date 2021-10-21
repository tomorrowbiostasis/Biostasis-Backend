import * as superTest from 'supertest';
import { clearDatabase } from './helper';
import { getTestApp } from './mock/app.mock';
import { initializeDataset } from './helper/user';
import * as faker from 'faker';
import {
  VALIDATION_FAILED,
  FILE_TYPE_IS_INVALID,
  FILE_IS_REQUIRED,
  FILE_IS_TOO_BIG,
  FILE_UPLOAD_FAILED,
  SAVE_FILE_FAILED,
  LIMIT_OF_NUMBER_OF_FILES_REACHED,
} from '../src/common/error/keys';
import { getFileById } from './entity/file.mock';
import { CATEGORY } from '../src/file/enum/category.enum';
import { configMock } from './mock/config.mock';
import { s3Mock } from './mock/s3.mock';
import { FileRepository } from '../src/file/repository/file.repository';

describe('/file (integration) ', () => {
  let app;
  let api: superTest.SuperTest<superTest.Test>;
  let dataset: any;

  const notValidCategoryCode = [
    '',
    faker.datatype.boolean(),
    faker.datatype.number(),
    faker.datatype.string(),
  ];

  beforeAll(async () => {
    app = await getTestApp();
    api = superTest(app.getHttpServer());
    await clearDatabase();

    dataset = await initializeDataset();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/file (POST)', () => {
    it('Should return status 403', async () => {
      await api
        .post('/file')
        .send()
        .expect(({ status }) => {
          expect(status).toBe(403);
        });

      await api
        .post('/file')
        .set('Authorization', faker.datatype.uuid())
        .send()
        .expect(({ status }) => {
          expect(status).toBe(403);
        });
    });

    for (const category of notValidCategoryCode) {
      it(`Should return status 400 and error VALIDATION_FAILED if category is ${category}`, async () => {
        await api
          .post('/file')
          .set('Authorization', dataset.user.id)
          .attach('file', null)
          .field('category', category)
          .expect(({ status, body }) => {
            expect(status).toBe(400);
            expect(body.error.code).toBe(VALIDATION_FAILED);
          });
      });
    }

    it('Should return status 400 and error FILE_IS_REQUIRED for invalid dataset', async () => {
      await api
        .post('/file')
        .set('Authorization', dataset.user.id)
        .attach('file', null)
        .field('category', CATEGORY.MEDICAL_DIRECTIVE)
        .expect(({ status, body }) => {
          expect(status).toBe(400);
          expect(body.error.code).toBe(FILE_IS_REQUIRED);
        });
    });

    it('Should return status 400 and error FILE_TYPE_IS_INVALID for invalid dataset', async () => {
      const filePath = `${__dirname}/mock/test.txt`;

      const { status, body } = await api
        .post('/file')
        .set('Authorization', dataset.user.id)
        .attach('file', filePath)
        .field('category', CATEGORY.MEDICAL_DIRECTIVE);

      expect(status).toBe(400);
      expect(body.error.code).toBe(FILE_TYPE_IS_INVALID);
    });

    it('Should return status 400 and error FILE_IS_TOO_BIG for invalid dataset', async () => {
      jest.spyOn(configMock, 'get').mockImplementationOnce(
        jest.fn((key): string | number => {
          if (key === 's3.fileSizeLimit') {
            return 0.001;
          }
        })
      );

      await api
        .post('/file')
        .set('Authorization', dataset.user.id)
        .attach('file', `${__dirname}/mock/test.png`)
        .field('category', CATEGORY.MEDICAL_DIRECTIVE)
        .expect(({ status, body }) => {
          expect(status).toBe(400);
          expect(body.error.code).toBe(FILE_IS_TOO_BIG);
        });
    });

    it('Should return status 400 and error FILE_UPLOAD_FAILED for invalid dataset', async () => {
      jest.spyOn(configMock, 'get').mockImplementationOnce(
        jest.fn((key): string | number => {
          if (key === 's3.fileSizeLimit') {
            return 1;
          }
        })
      );

      jest
        .spyOn(s3Mock, 'upload')
        .mockImplementationOnce(
          jest.fn((params, cb) => cb(new Error('error'), {}))
        );

      await api
        .post('/file')
        .set('Authorization', dataset.user.id)
        .attach('file', `${__dirname}/mock/test.png`)
        .field('category', CATEGORY.MEDICAL_DIRECTIVE)
        .expect(({ status, body }) => {
          expect(status).toBe(400);
          expect(body.error.code).toBe(FILE_UPLOAD_FAILED);
        });
    });

    it('Should return status 400 and error SAVE_FILE_FAILED for invalid dataset', async () => {
      jest.spyOn(FileRepository.prototype, 'save').mockImplementationOnce(
        jest.fn(async () => {
          throw new Error();
        })
      );

      await api
        .post('/file')
        .set('Authorization', dataset.user.id)
        .attach('file', `${__dirname}/mock/test.png`)
        .field('category', CATEGORY.MEDICAL_DIRECTIVE)
        .expect(({ status, body }) => {
          expect(status).toBe(400);
          expect(body.error.code).toBe(SAVE_FILE_FAILED);
        });
    });

    it('Should add contact, return status 201 and valid body', async () => {
      await api
        .post('/file')
        .set('Authorization', dataset.user.id)
        .attach('file', `${__dirname}/mock/test.png`)
        .field('category', CATEGORY.MEDICAL_DIRECTIVE)
        .expect(async ({ status, body }) => {
          expect(status).toBe(201);
          expect(body.id).toBeDefined();

          const file = await getFileById(body.id);

          expect(file.name).toBe('test.png');
        });

      await api
        .post('/file')
        .set('Authorization', dataset.user.id)
        .attach('file', `${__dirname}/mock/test.png`)
        .field('category', CATEGORY.MEDICAL_DIRECTIVE)
        .expect(async ({ status, body }) => {
          expect(status).toBe(400);
          expect(body.error.code).toBe(LIMIT_OF_NUMBER_OF_FILES_REACHED);
        });
    });
  });
});
