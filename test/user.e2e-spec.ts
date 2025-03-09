import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';

import { INestApplication } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AppModule } from '../src/app.module';
import { JwtService } from '@nestjs/jwt';
import { AuthPayload } from '../src/auth/entities/payload';
import * as cookieParser from 'cookie-parser';

describe('User test (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let testUserId: string;
  let access_token: string;
  let jwtService: JwtService;

  //아래의 테스트 코드는 별도의 테스트용 db를 구축하지 않아 실제 db에 테스트 실행 내용이 반영되며
  //순서대로 생성,조회,수정,삭제대로 진행하며 테스트 완료후 생성된 user는 직접 삭제

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [PrismaService],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser());
    await app.init();
    prisma = moduleFixture.get<PrismaService>(PrismaService);
    jwtService = moduleFixture.get<JwtService>(JwtService);

    //테스트 시작전 테스트에 사용할 user 생성
    const { id } = await prisma.user.create({
      data: {
        email: 'e2e-test-init@test.com',
        password: 'not important',
        name: 'e2e-test-init-user',
      },
    });

    testUserId = id;

    //테스트유저 jwt 토큰
    const payload: AuthPayload = {
      username: 'e2e-test-init-user',
      email: 'e2e-test-init@test.com',
    };
    access_token = await jwtService.signAsync(payload);
  });

  it('/user (GET) 유저 조회', () => {
    //격리된 환경이 아니라 정확한 응답 비교는 생략
    return request(app.getHttpServer())
      .get('/user')
      .set('Cookie', [`access_token=${access_token}`])
      .expect(200);
  });

  it('/user (POST) 유저 생성', () => {
    return request(app.getHttpServer())
      .post('/user')
      .set('Accept', 'application/json')
      .send({
        email: 'e2e-test@test.com',
        password: 'test1234',
        name: 'e2e-test-user',
      })
      .expect(201);
  });

  it('/user/:id (PATCH) 유저 업데이트', () => {
    return request(app.getHttpServer())
      .patch(`/user/${testUserId}`)
      .set('Cookie', [`access_token=${access_token}`])
      .send({
        password: 'test4321',
        name: 'e2e-user-update-test',
      })
      .expect(200)
      .expect(`This action updates a #${testUserId} user`);
  });

  it('/user/:id (DELETE) 유저 삭제', () => {
    return request(app.getHttpServer())
      .delete(`/user/${testUserId}`)
      .set('Cookie', [`access_token=${access_token}`])
      .expect(200)
      .expect(`User '${testUserId}' was deleted.`);
  });

  afterAll(async () => {
    await prisma.user.deleteMany({
      where: {
        email: { in: ['e2e-test-init@test.com', 'e2e-test@test.com'] },
      },
    });
  });
});
