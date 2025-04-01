import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { QueryFailedError, Repository } from 'typeorm';
import { Movie } from './entities/movie.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DatabaseError } from 'pg-protocol';
import { PostgresErrorCode } from 'src/database/postgresErrorCodes.enum';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private readonly moviesRepository: Repository<Movie>,
  ) {}

  async findAll() {
    return await this.moviesRepository.find();
  }

  async create(createMovieDto: CreateMovieDto) {
    const movie = new Movie(createMovieDto);
    try {
      return await this.moviesRepository.save(movie);
    } catch (err) {
      if (
        err instanceof QueryFailedError &&
        err.driverError instanceof DatabaseError
      ) {
        if (err.driverError.code === PostgresErrorCode.UniqueViolation) {
          throw new BadRequestException(
            `a movie with the name '${movie.title}' already exists.`,
          );
        }
      }
      throw err;
    }
  }

  async update(title: string, updateMovieDto: UpdateMovieDto) {
    const movie = await this.moviesRepository.findOneBy({ title: title });
    if (!movie) return null;
    Object.assign(movie, updateMovieDto);
    try {
      return await this.moviesRepository.save(movie);
    } catch (err) {
      if (
        err instanceof QueryFailedError &&
        err.driverError instanceof DatabaseError
      ) {
        if (err.driverError.code === PostgresErrorCode.UniqueViolation) {
          throw new BadRequestException(
            `a movie with the name '${movie.title}' already exists.`,
          );
        }
      }
      throw err;
    }
  }

  async remove(title: string) {
    await this.moviesRepository.delete({ title: title });
  }
}
