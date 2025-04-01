import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Showtime } from 'src/showtimes/entities/showtime.entity';
import { BookingsModule } from 'src/bookings/bookings.module';
import { Booking } from 'src/bookings/entitites/booking.entity';
import { CreateBookingDto } from 'src/bookings/dto/create-booking.dto';
import { randomUUID } from 'node:crypto';
import { isUUID } from 'class-validator';

describe('Bookings (e2e)', () => {
  let app: INestApplication;

  const mockBookingsRepository = {
    save: jest
      .fn()
      .mockImplementation((booking) => ({ id: randomUUID(), ...booking })),
  };

  const mockShowtimesRepository = {
    findOneBy: jest.fn().mockImplementation(({ id }) => {
      if (id != 1) return null;
      return {
        id: 1,
        price: 50.2,
        movieId: 1,
        theater: 'Sample Theater',
        startTime: new Date('2025-02-14T11:47:46Z'),
        endTime: new Date('2025-02-14T14:47:46Z'),
      };
    }),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [BookingsModule],
    })
      .overrideProvider(getRepositoryToken(Booking))
      .useValue(mockBookingsRepository)
      .overrideProvider(getRepositoryToken(Showtime))
      .useValue(mockShowtimesRepository)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('POST /bookings', () => {
    it('creates booking', async () => {
      const bookingDto: CreateBookingDto = {
        showtimeId: 1,
        seatNumber: 15,
        userId: '84438967-f68f-4fa0-b620-0f08217e76af',
      };

      const res = await request(app.getHttpServer())
        .post('/bookings/')
        .send(bookingDto)
        .expect(HttpStatus.OK);

      expect(isUUID(res.body.bookingId)).toBe(true);
    });

    it('fails when fields are missing', async () => {
      const bookingDto = {
        seatNumber: 15,
        userId: '84438967-f68f-4fa0-b620-0f08217e76af',
      };

      const res = await request(app.getHttpServer())
        .post('/bookings/')
        .send(bookingDto)
        .expect(HttpStatus.BAD_REQUEST);

      expect(res.body).toMatchObject({
        error: expect.any(String),
      });
    });

    it('fails when fields are invalid', async () => {
      const bookingDto = {
        showtimeId: 1,
        seatNumber: 15,
        userId: '84438967-fsad68f-4fa0-b620-0f08217e76af',
      };

      const res = await request(app.getHttpServer())
        .post('/bookings/')
        .send(bookingDto)
        .expect(HttpStatus.BAD_REQUEST);

      expect(res.body).toMatchObject({
        error: expect.any(String),
      });
    });

    it('fails when showtime does not exist', async () => {
      const bookingDto = {
        showtimeId: 2,
        seatNumber: 15,
        userId: '84438967-fsad68f-4fa0-b620-0f08217e76af',
      };

      const res = await request(app.getHttpServer())
        .post('/bookings/')
        .send(bookingDto)
        .expect(HttpStatus.BAD_REQUEST);

      expect(res.body).toMatchObject({
        error: expect.any(String),
      });
    });
  });
});
