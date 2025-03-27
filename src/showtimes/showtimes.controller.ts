import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  NotFoundException,
} from '@nestjs/common';
import { ShowtimesService } from './showtimes.service';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import { UpdateShowtimeDto } from './dto/update-showtime.dto';
import { Showtime } from './entities/showtime.entity';

@Controller('showtimes')
export class ShowtimesController {
  constructor(private readonly showtimesService: ShowtimesService) {}

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Showtime> {
    const showtime = await this.showtimesService.findOne(+id);
    if (!showtime)
      throw new NotFoundException(`Showtime with id #${id} not found`);
    return showtime;
  }

  @Post()
  @HttpCode(200)
  async create(
    @Body() createShowtimeDto: CreateShowtimeDto,
  ): Promise<Showtime> {
    return await this.showtimesService.create(createShowtimeDto);
  }

  @Post('update/:id')
  @HttpCode(200)
  async update(
    @Param('id') id: string,
    @Body() updateShowtimeDto: UpdateShowtimeDto,
  ) {
    const showtime = await this.showtimesService.update(+id, updateShowtimeDto);
    if (!showtime)
      throw new NotFoundException(`Showtime with id '${id}' does not exist`);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.showtimesService.remove(+id);
  }
}
