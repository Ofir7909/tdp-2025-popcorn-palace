import { Injectable } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { EntityManager, Repository } from 'typeorm';
import { Movie } from './entities/movie.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private readonly moviesRepository: Repository<Movie>,
    private readonly entityManager: EntityManager,
  ) {}

  async findAll() {
    return await this.moviesRepository.find();
  }

  async create(createMovieDto: CreateMovieDto) {
    const movie = new Movie(createMovieDto);
    return await this.entityManager.save(movie);
  }

  async update(title: string, updateMovieDto: UpdateMovieDto) {
    const movie = await this.moviesRepository.findOneBy({ title: title });
    if (!movie) return null;
    Object.assign(movie, updateMovieDto);
    return await this.entityManager.save(movie);
  }

  async remove(title: string) {
    await this.moviesRepository.delete({ title: title });
  }
}
