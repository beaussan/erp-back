import { HttpServer, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let httpAdapter: HttpServer;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    httpAdapter = app.getHttpAdapter().getHttpServer();
  });

  it('/ping (GET)', async () => {
    return request(httpAdapter)
      .get('/ping')
      .expect(200)
      .expect('pong');
  });

  describe('Login flow', () => {
    describe('/auth/register (POST)', () => {
      it('should error on duplicate email', async () => {
        const email = `${new Date().getTime()}@test.fr`;
        const firstName = 'first';
        const lastName = 'last';
        const password = 'AAAAAAAA';

        // console.dir(app.getHttpAdapter());
        await request(httpAdapter)
          .post('/auth/register')
          .send({ email, firstName, lastName, password })
          .expect('Content-Type', /json/)
          .expect(201);

        const responce1 = await request(httpAdapter)
          .post('/auth/register')
          .send({ email, firstName, lastName, password })
          .expect('Content-Type', /json/)
          .expect(409);

        expect(responce1.body).toHaveProperty('statusCode');
        expect(responce1.body).toHaveProperty('error');
        expect(responce1.body).toHaveProperty('message');
        expect(responce1.body.statusCode).toBe(409);
        expect(responce1.body.error).toBe('Conflict');
        expect(responce1.body.message).toBe('Email already taken');
      });

      it('should return the user when register', async () => {
        const email = `${new Date().getTime()}@test.fr`;
        const firstName = 'first';
        const lastName = 'last';
        const password = 'AAAAAAAA';

        // console.dir(app.getHttpAdapter());
        const response = await request(httpAdapter)
          .post('/auth/register')
          .send({ email, firstName, lastName, password })
          .expect('Content-Type', /json/)
          .expect(201);

        expect(response.body).toHaveProperty('_id');
        expect(response.body).toHaveProperty('email');
        expect(response.body).toHaveProperty('lastName');
        expect(response.body).toHaveProperty('firstName');
        expect(response.body).toHaveProperty('roles');
        expect(response.body.email).toBe(email);
        expect(response.body.lastName).toBe(lastName);
        expect(response.body.firstName).toBe(firstName);
        expect(response.body.roles).toHaveLength(1);
        expect(response.body.roles[0]).toBe('USER_ROLE');
      });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
