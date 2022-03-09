import * as superTest from 'supertest';
import { clearDatabase } from './helper';
import { getTestApp } from './mock/app.mock';
import { initializeDataset } from './helper/contact';
import * as faker from 'faker';
import {
  FILE_NOT_FOUND,
  DELETE_FILE_FROM_S3_FAILED,
  DELETE_FILE_FROM_DB_FAILED,
} from '../src/common/error/keys';
import { CATEGORY } from '../src/file/enum/category.enum';
import { getFileById } from './entity/file.mock';
import { s3Mock } from './mock/s3.mock';
import { FileRepository } from '../src/file/repository/file.repository';

describe('/file (integration) ', () => {
  let app;
  let api: superTest.SuperTest<superTest.Test>;
  let dataset: any;

  beforeAll(async () => {
    app = await getTestApp();
    api = superTest(app.getHttpServer());
    await clearDatabase();

    dataset = await initializeDataset();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/file/:id (DELETE)', () => {
    it('Should return status 403', async () => {
      await api
        .delete(`/file/${faker.datatype.number()}`)
        .send()
        .expect(({ status }) => {
          expect(status).toBe(403);
        });

      await api
        .delete(`/file/${faker.datatype.number()}`)
        .set('Authorization', faker.datatype.uuid())
        .send()
        .expect(({ status }) => {
          expect(status).toBe(403);
        });
    });

    it('Should return status 400 and error FILE_NOT_FOUND for invalid dataset', async () => {
      const { body } = await api
        .post('/file')
        .set('Authorization', dataset.users[1].id)
        .attach('file', `${__dirname}/mock/test.png`)
        .field('category', CATEGORY.MEDICAL_DIRECTIVE)
        .expect(async ({ status, body }) => {
          expect(status).toBe(201);
        });

      const file = await getFileById(body?.id);

      expect(file.id).toBe(body.id);

      await api
        .delete(`/file/${file.id}`)
        .set('Authorization', dataset.users[0].id)
        .then((result) => {
          expect(result.status).toBe(400);
          expect(result.body.error.code).toBe(FILE_NOT_FOUND);
        });

      await api
        .delete(`/file/${faker.datatype.number()}`)
        .set('Authorization', dataset.users[0].id)
        .then((result) => {
          expect(result.status).toBe(400);
          expect(result.body.error.code).toBe(FILE_NOT_FOUND);
        });
    });

    it('Should return status 400 and error DELETE_FILE_FROM_S3_FAILED for invalid dataset', async () => {
      jest
        .spyOn(s3Mock, 'deleteObject')
        .mockImplementationOnce(
          jest.fn((params, cb) => cb(new Error('error'), {}))
        );

      const { body: file } = await api
        .post('/file')
        .set('Authorization', dataset.users[0].id)
        .attach('file', `${__dirname}/mock/test.png`)
        .field('category', CATEGORY.MEDICAL_DIRECTIVE)
        .expect(async ({ status, body }) => {
          expect(status).toBe(201);
        });

      await api
        .delete(`/file/${file.id}`)
        .set('Authorization', dataset.users[0].id)
        .then((result) => {
          expect(result.status).toBe(400);
          expect(result.body.error.code).toBe(DELETE_FILE_FROM_S3_FAILED);
        });
    });

    it('Should return status 400 and error DELETE_FILE_FROM_DB_FAILED for invalid dataset', async () => {
      jest.spyOn(FileRepository.prototype, 'delete').mockImplementationOnce(
        jest.fn(async () => {
          throw new Error();
        })
      );

      const { body: file } = await api
        .post('/file')
        .set('Authorization', dataset.users[0].id)
        .attach('file', `${__dirname}/mock/test.png`)
        .field('category', CATEGORY.OTHER)
        .expect(async ({ status, body }) => {
          expect(status).toBe(201);
        });

      await api
        .delete(`/file/${file.id}`)
        .set('Authorization', dataset.users[0].id)
        .then((result) => {
          expect(result.status).toBe(400);
          expect(result.body.error.code).toBe(DELETE_FILE_FROM_DB_FAILED);
        });
    });

    it('Should delete contact, return status 200 and valid body', async () => {
      const { body: file } = await api
        .post('/file')
        .set('Authorization', dataset.users[0].id)
        .attach('file', `${__dirname}/mock/test.png`)
        .field('category', CATEGORY.OTHER)
        .expect(async ({ status, body }) => {
          expect(status).toBe(201);
        });

      await api
        .delete(`/file/${file.id}`)
        .set('Authorization', dataset.users[0].id)
        .send()
        .expect(async ({ status }) => {
          expect(status).toBe(200);
        });

      const fileDB = await getFileById(file.id);

      expect(fileDB).toBeUndefined();
    });
  });
});
