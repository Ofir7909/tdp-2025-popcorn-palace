import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateMovieDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  genre: string;

  @IsInt()
  @Min(0)
  duration: number;

  @IsNumber()
  @Max(10)
  @Min(0)
  rating: number;

  @IsInt()
  @Min(0)
  releaseYear: number;
}
