export class CreateBookingDto {
  showtimeId: number;
  seatNumber: number;
  userId: string;
}

export class CreateBookingResponseDto {
  bookingId: string;
}
