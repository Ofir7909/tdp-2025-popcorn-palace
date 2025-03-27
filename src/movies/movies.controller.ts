import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post()
  @HttpCode(200)
  async create(@Body() createMovieDto: CreateMovieDto) {
    return this.moviesService.create(createMovieDto);
  }

  @Get('all')
  async findAll() {
    return this.moviesService.findAll();
  }

  @Post('update/:title')
  async update(
    @Param('title') title: string,
    @Body() updateMovieDto: UpdateMovieDto,
  ) {
    return this.moviesService.update(title, updateMovieDto);
  }

  @Delete(':title')
  async remove(@Param('title') title: string) {
    return this.moviesService.remove(title);
  }
}
