import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import { UpdateShowtimeDto } from './dto/update-showtime.dto';
import { Showtime } from './entities/showtime.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, LessThan, MoreThan, Not, Repository } from 'typeorm';
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

  async isTheatherOccupied(
    theather: string,
    startTime: Date,
    endTime: Date,
    excludeId: number = -1,
  ): Promise<boolean> {
    const occupied = await this.showtimesRepository.existsBy({
      theater: theather,
      startTime: LessThan(endTime),
      endTime: MoreThan(startTime),
      id: Not(excludeId),
    });
    return occupied;
  }

  async create(createShowtimeDto: CreateShowtimeDto): Promise<Showtime> {
    let movie = await this.moviesRepository.findOneBy({
      id: createShowtimeDto.movieId,
    });
    if (!movie) {
      throw new BadRequestException('movie does not exist');
    }
    if (createShowtimeDto.startTime > createShowtimeDto.endTime) {
      throw new BadRequestException('startTime must be before endTime');
    }
    if (
      await this.isTheatherOccupied(
        createShowtimeDto.theater,
        createShowtimeDto.startTime,
        createShowtimeDto.endTime,
      )
    ) {
      throw new BadRequestException(
        'theater is occupied during the requested time',
      );
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

    if (updateShowtimeDto.movieId) {
      let movie = await this.moviesRepository.findOneBy({
        id: updateShowtimeDto.movieId,
      });
      if (!movie) {
        throw new BadRequestException('movie does not exist');
      }
    }
    if (updateShowtimeDto.startTime || updateShowtimeDto.endTime) {
      const theater = updateShowtimeDto.theater || showtime.theater;
      const startTime = new Date(
        updateShowtimeDto.startTime || showtime.startTime,
      );
      const endTime = new Date(updateShowtimeDto.endTime || showtime.endTime);

      if (startTime > endTime) {
        throw new BadRequestException('startTime must be before endTime');
      }

      if (await this.isTheatherOccupied(theater, startTime, endTime, id)) {
        throw new BadRequestException(
          'theater is occupied during the requested time',
        );
      }
    }
    Object.assign(showtime, updateShowtimeDto);
    return this.entityManager.save(showtime);
  }

  async remove(id: number): Promise<void> {
    await this.showtimesRepository.delete({ id: id });
  }
}
