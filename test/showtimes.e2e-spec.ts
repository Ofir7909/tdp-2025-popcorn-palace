import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Movie } from 'src/movies/entities/movie.entity';
import { Showtime } from 'src/showtimes/entities/showtime.entity';
import { ShowtimesModule } from 'src/showtimes/showtimes.module';

describe('Showtimes (e2e)', () => {
  let app: INestApplication;

  const mockMovies = [
    {
      id: 1,
      duration: 120,
      genre: 'action',
      title: 'Die Hard',
      rating: 9.5,
      releaseYear: 2000,
    },
  ];

  const mockMoviesRepository = {
    findOneBy: jest.fn().mockImplementation(({ id }) => {
      return mockMovies.find((m) => m.id === id);
    }),
  };

  const mockShowtimes = [
    {
      id: 1,
      price: 50.2,
      movieId: 1,
      theater: 'Sample Theater',
      startTime: new Date('2025-02-14T11:47:46Z'),
      endTime: new Date('2025-02-14T14:47:46Z'),
    },
  ];

  const mockShowtimesRepository = {
    findOneBy: jest.fn().mockImplementation(({ id }) => {
      return mockShowtimes.find((st) => st.id === id);
    }),
    save: jest.fn().mockImplementation((showtime) => ({ id: 1, ...showtime })),
    delete: jest.fn(),
    existsBy: jest.fn().mockResolvedValue(false),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ShowtimesModule],
    })
      .overrideProvider(getRepositoryToken(Movie))
      .useValue(mockMoviesRepository)
      .overrideProvider(getRepositoryToken(Showtime))
      .useValue(mockShowtimesRepository)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('GET /showtimes/{showtimeId}', () => {
    it('returns showtime object', async () => {
      const res = await request(app.getHttpServer())
        .get('/showtimes/1')
        .expect(HttpStatus.OK);

      expect(res.body).toMatchObject({
        id: expect.any(Number),
        price: 50.2,
        movieId: 1,
        theater: 'Sample Theater',
      });

      expect(new Date(res.body.startTime).toISOString()).toBe(
        '2025-02-14T11:47:46.000Z',
      );
      expect(new Date(res.body.endTime).toISOString()).toBe(
        '2025-02-14T14:47:46.000Z',
      );
    });

    it('fails when id is not int', async () => {
      const res = await request(app.getHttpServer())
        .get('/showtimes/abc')
        .expect(HttpStatus.BAD_REQUEST);

      expect(res.body).toMatchObject({
        error: expect.any(String),
      });
    });

    it('fails when showtimes does not exist', async () => {
      const res = await request(app.getHttpServer())
        .get('/showtimes/777')
        .expect(HttpStatus.NOT_FOUND);

      expect(res.body).toMatchObject({
        error: expect.any(String),
      });
    });
  });

  describe('POST /showtimes', () => {
    it('creates a showtime', async () => {
      const showtimeDto = {
        movieId: 1,
        price: 20.2,
        theater: 'Sample Theater',
        startTime: '2025-02-14T11:47:46.125405Z',
        endTime: '2025-02-14T14:47:46.125405Z',
      };

      const res = await request(app.getHttpServer())
        .post('/showtimes/')
        .send(showtimeDto)
        .expect(HttpStatus.OK);

      expect(res.body).toMatchObject({
        id: expect.any(Number),
        ...showtimeDto,
      });
    });

    it('fails when movie does not exist', async () => {
      const showtimeDto = {
        movieId: 777,
        price: 20.2,
        theater: 'Sample Theater',
        startTime: '2025-02-14T11:47:46.125405Z',
        endTime: '2025-02-14T14:47:46.125405Z',
      };

      const res = await request(app.getHttpServer())
        .post('/showtimes/')
        .send(showtimeDto)
        .expect(HttpStatus.BAD_REQUEST);

      expect(res.body).toMatchObject({
        error: expect.any(String),
      });
    });

    it('fails on missing fields', async () => {
      const showtimeDto = {
        movieId: 1,
        theater: 'Sample Theater',
        startTime: '2025-02-14T11:47:46.125405Z',
        endTime: '2025-02-14T14:47:46.125405Z',
      };

      const res = await request(app.getHttpServer())
        .post('/showtimes/')
        .send(showtimeDto)
        .expect(HttpStatus.BAD_REQUEST);

      expect(res.body).toMatchObject({
        error: expect.any(String),
      });
    });

    it('fails on invlaid fields', async () => {
      const showtimeDto = {
        movieId: 1,
        price: 20.2,
        theater: 'Sample Theater',
        startTime: '2025--02-14T11:47:46.125405Z',
        endTime: '2025-02-14T14:47:46.125405Z',
      };

      const res = await request(app.getHttpServer())
        .post('/showtimes/')
        .send(showtimeDto)
        .expect(HttpStatus.BAD_REQUEST);

      expect(res.body).toMatchObject({
        error: expect.any(String),
      });
    });

    it('fails if theater is occupied', async () => {
      mockShowtimesRepository.existsBy = jest.fn().mockResolvedValue(true);

      const showtimeDto = {
        movieId: 1,
        price: 20.2,
        theater: 'Sample Theater',
        startTime: '2025-02-14T11:47:46.125405Z',
        endTime: '2025-02-14T14:47:46.125405Z',
      };

      const res = await request(app.getHttpServer())
        .post('/showtimes/')
        .send(showtimeDto)
        .expect(HttpStatus.BAD_REQUEST);

      expect(res.body).toMatchObject({
        error: expect.any(String),
      });
    });
  });

  describe('POST /showtimes/update/{showtimeId}', () => {
    it('updates showtime details', async () => {
      const showtimeDto = {
        theater: 'New Theater',
        price: 30,
      };

      const res = await request(app.getHttpServer())
        .post('/showtimes/update/1')
        .send(showtimeDto)
        .expect(HttpStatus.OK);

      expect(res.body).toEqual({});
    });

    it('fails if id does not exist', async () => {
      const showtimeDto = {
        theater: 'New Theater',
        price: 30,
      };

      const res = await request(app.getHttpServer())
        .post('/showtimes/update/123')
        .send(showtimeDto)
        .expect(HttpStatus.NOT_FOUND);

      expect(res.body).toMatchObject({
        error: expect.any(String),
      });
    });

    it('fails if id is not int', async () => {
      const showtimeDto = {
        theater: 'New Theater',
        price: 30,
      };

      const res = await request(app.getHttpServer())
        .post('/showtimes/update/abc')
        .send(showtimeDto)
        .expect(HttpStatus.BAD_REQUEST);

      expect(res.body).toMatchObject({
        error: expect.any(String),
      });
    });
  });

  describe('DELETE /showtimes/{showtimeId}', () => {
    it('should return empty body', async () => {
      const res = await request(app.getHttpServer())
        .delete('/showtimes/1')
        .expect(HttpStatus.OK);

      expect(res.body).toEqual({});
    });
  });
});
