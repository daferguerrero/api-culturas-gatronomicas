import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { CityService } from './city.service';
import { plainToInstance } from 'class-transformer';
import { CityDto } from './city.dto';
import { CityEntity } from './city.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from '../roles.guard';
import { Roles } from '../roles.decorator';

@Controller('city')
@UseInterceptors(BusinessErrorsInterceptor)
@UseGuards(JwtAuthGuard, RolesGuard)
export class CityController {
  constructor(private readonly cityService: CityService) {}

  @Get()
  @Roles('reader')
  async findAll() {
    return await this.cityService.findAll();
  }

  @Get(':cityId')
  @Roles('reader', 'reader_single')
  async findOne(@Param('cityId') cityId: string) {
    return await this.cityService.findOne(cityId);
  }

  @Post()
  @Roles('writer', 'user')
  async create(@Body() cityDto: CityDto) {
    const city: CityEntity = plainToInstance(CityEntity, cityDto);
    return await this.cityService.create(city);
  }

  @Put(':cityId')
  @Roles('writer', 'user')
  async update(@Param('cityId') cityId: string, @Body() cityDto: CityDto) {
    const city: CityEntity = plainToInstance(CityEntity, cityDto);
    return await this.cityService.update(cityId, city);
  }

  @Delete(':cityId')
  @HttpCode(204)
  @Roles('deleter')
  async delete(@Param('cityId') cityId: string) {
    return await this.cityService.remove(cityId);
  }
}
