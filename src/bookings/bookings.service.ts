import { BadRequestException, Injectable } from '@nestjs/common';
import { Booking } from './entitites/booking.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Showtime } from 'src/showtimes/entities/showtime.entity';
import { EntityManager, QueryFailedError, Repository } from 'typeorm';
import { CreateBookingDto } from './dto/create-booking.dto';
import { DatabaseError } from 'pg-protocol';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Showtime)
    private readonly showtimesRepository: Repository<Showtime>,
    private readonly entityManager: EntityManager,
  ) {}

  async create(createBookingDto: CreateBookingDto): Promise<Booking> {
    let showtime = await this.showtimesRepository.findOneBy({
      id: createBookingDto.showtimeId,
    });
    if (!showtime) {
      throw new BadRequestException('showtime does not exist');
    }
    let booking = new Booking(createBookingDto);

    try {
      return await this.entityManager.save(booking);
    } catch (err) {
      if (
        err instanceof QueryFailedError &&
        err.driverError instanceof DatabaseError
      ) {
        if (err.driverError.code === PostgresErrorCode.UniqueViolation) {
          throw new BadRequestException('this seat is occupied');
        }
      }
      throw err;
    }
  }
}
