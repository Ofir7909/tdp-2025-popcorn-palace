import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import { UpdateShowtimeDto } from './dto/update-showtime.dto';
import { Showtime } from './entities/showtime.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Movie } from 'src/movies/entities/movie.entity';

@Injectable()
export class ShowtimesService {
  constructor(
    @InjectRepository(Showtime)
    private readonly showtimesRepository: Repository<Showtime>,
    @InjectRepository(Movie)
    private readonly moviesRepository: Repository<Movie>,
    private readonly entityManager: EntityManager,
  ) {}

  async findOne(id: number): Promise<Showtime> {
    return this.showtimesRepository.findOneBy({ id: id });
  }

  async create(createShowtimeDto: CreateShowtimeDto): Promise<Showtime> {
    let movie = await this.moviesRepository.findOneBy({
      id: createShowtimeDto.movieId,
    });
    if (!movie) {
      throw new BadRequestException('movie does not exist');
    }
    let showtime = new Showtime(createShowtimeDto);
    return this.entityManager.save(showtime);
  }

  async update(
    id: number,
    updateShowtimeDto: UpdateShowtimeDto,
  ): Promise<Showtime> {
    const showtime = await this.findOne(id);
    if (!showtime) return null;
    Object.assign(showtime, updateShowtimeDto);
    return this.entityManager.save(showtime);
  }

  async remove(id: number): Promise<void> {
    await this.showtimesRepository.delete({ id: id });
  }
}
