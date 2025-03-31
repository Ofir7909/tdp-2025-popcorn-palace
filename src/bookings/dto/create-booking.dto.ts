import { IsInt, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateBookingDto {
  @IsInt()
  showtimeId: number;

  @IsInt()
  seatNumber: number;

  @IsUUID()
  userId: string;
}

export class CreateBookingResponseDto {
  bookingId: string;
}
