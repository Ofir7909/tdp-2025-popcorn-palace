import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import {
  CreateBookingDto,
  CreateBookingResponseDto,
} from './dto/create-booking.dto';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @HttpCode(200)
  async create(
    @Body() createBookingDto: CreateBookingDto,
  ): Promise<CreateBookingResponseDto> {
    const booking = await this.bookingsService.create(createBookingDto);
    return { bookingId: booking.id };
  }
}
