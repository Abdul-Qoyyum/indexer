import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('RepositoryController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    app.setGlobalPrefix('api/v1');
    await app.init();
  });

  it('/api/v1/repository/index (POST)', async () => {
    const repository = {
      owner: 'Abdul-Qoyyum',
      repo: 'indexer',
    };

    const response = await request(app.getHttpServer())
      .post('/api/v1/repository/index')
      .send(repository)
      .expect(201)
      .expect((res) => {
        expect(res.body.data.full_name).toEqual('Abdul-Qoyyum/indexer');
      });

    return response;
  });

  afterAll(async () => {
    await app.close();
  });
});
