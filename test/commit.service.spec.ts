import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('CommitsController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    app.setGlobalPrefix('api/v1');
    await app.init();
  });

  it('/api/v1/commits (GET)', async () => {
    return await request(app.getHttpServer())
      .get('/api/v1/commits?repository_name=unknown')
      .expect(200)
      .expect((res) => {
        expect(res.body.data.commits).toEqual([]);
        expect(res.body.data.total).toEqual(0);
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
