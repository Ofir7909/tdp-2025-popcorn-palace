import { Module } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './entitites/booking.entity';
import { Showtime } from 'src/showtimes/entities/showtime.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Booking, Showtime])],
  controllers: [BookingsController],
  providers: [BookingsService],
})
export class BookingsModule {}
