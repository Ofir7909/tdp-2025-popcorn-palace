import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { MoviesModule } from 'src/movies/movies.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Movie } from 'src/movies/entities/movie.entity';
import { CreateMovieDto } from 'src/movies/dto/create-movie.dto';

describe('Movies (e2e)', () => {
  let app: INestApplication;

  const mockMovies = [
    {
      id: 5,
      duration: 120,
      genre: 'action',
      title: 'Die Hard',
      rating: 9.5,
      releaseYear: 2000,
    },
  ];

  const mockMoviesRepository = {
    find: jest.fn().mockImplementation(() => mockMovies),
    findOneBy: jest.fn().mockImplementation(({ title }) => {
      return mockMovies.find((m) => m.title === title);
    }),
    save: jest.fn().mockImplementation((movie) => ({ id: 1, ...movie })),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [MoviesModule],
    })
      .overrideProvider(getRepositoryToken(Movie))
      .useValue(mockMoviesRepository)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('GET /movies/', () => {
    it('returns all movies', async () => {
      const res = await request(app.getHttpServer())
        .get('/movies/all')
        .expect(HttpStatus.OK);

      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe('POST /movies/', () => {
    it('create a movie', async () => {
      const movieDto: CreateMovieDto = {
        duration: 120,
        genre: 'action',
        title: 'Die Hard',
        rating: 9.5,
        releaseYear: 2000,
      };

      const res = await request(app.getHttpServer())
        .post('/movies/')
        .send(movieDto)
        .expect(HttpStatus.OK);

      expect(res.body).toMatchObject({
        id: expect.any(Number),
        ...movieDto,
      });
    });

    it('fails when fields are missing', async () => {
      const movieDto: Partial<CreateMovieDto> = {
        duration: 120,
        title: 'Die Hard',
        rating: 9.5,
        releaseYear: 2000,
      };

      const res = await request(app.getHttpServer())
        .post('/movies/')
        .send(movieDto)
        .expect(HttpStatus.BAD_REQUEST);

      expect(res.body).toMatchObject({
        error: expect.any(String),
      });
    });

    it('fails when field is invalid', async () => {
      const movieDto: Partial<CreateMovieDto> = {
        duration: 120.5,
        genre: 'action',
        title: 'Die Hard',
        rating: 9.5,
        releaseYear: 2000,
      };

      const res = await request(app.getHttpServer())
        .post('/movies/')
        .send(movieDto)
        .expect(HttpStatus.BAD_REQUEST);

      expect(res.body).toMatchObject({
        error: expect.any(String),
      });
    });
  });

  describe('POST /movies/update/{movieTitle}', () => {
    it('updates movie details', async () => {
      const movieDto: Partial<CreateMovieDto> = {
        rating: 6,
      };

      const res = await request(app.getHttpServer())
        .post('/movies/update/Die%20Hard')
        .send(movieDto)
        .expect(HttpStatus.OK);

      expect(res.body).toEqual({});
    });

    it('fails if movie does not exist', async () => {
      const movieDto: Partial<CreateMovieDto> = {
        rating: 6,
      };

      const res = await request(app.getHttpServer())
        .post('/movies/update/Seven')
        .send(movieDto)
        .expect(HttpStatus.NOT_FOUND);

      expect(res.body).toMatchObject({
        error: expect.any(String),
      });
    });
  });

  describe('DELETE /movies/{movieTitle}', () => {
    it('should return empty body', async () => {
      const res = await request(app.getHttpServer())
        .delete('/movies/Die%20Hard')
        .expect(HttpStatus.OK);

      expect(res.body).toEqual({});
    });
  });
});
