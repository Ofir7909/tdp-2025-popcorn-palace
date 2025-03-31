import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  NotFoundException,
  ValidationPipe,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get('all')
  async findAll() {
    return this.moviesService.findAll();
  }

  @Post()
  @HttpCode(200)
  async create(@Body(ValidationPipe) createMovieDto: CreateMovieDto) {
    return this.moviesService.create(createMovieDto);
  }

  @Post('update/:title')
  @HttpCode(200)
  async update(
    @Param('title') title: string,
    @Body(ValidationPipe) updateMovieDto: UpdateMovieDto,
  ) {
    const movie = await this.moviesService.update(title, updateMovieDto);
    if (!movie) {
      throw new NotFoundException(`Movie with title '${title}' does not exist`);
    }
  }

  @Delete(':title')
  async remove(@Param('title') title: string) {
    return this.moviesService.remove(title);
  }
}
