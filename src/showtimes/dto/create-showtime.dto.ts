import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
} from 'class-validator';

export class CreateShowtimeDto {
  @IsNumber()
  @Min(0)
  price: number;

  @IsInt()
  movieId: number;

  @IsString()
  @IsNotEmpty()
  theater: string;

  @IsDateString()
  startTime: Date;

  @IsDateString()
  endTime: Date;
}
