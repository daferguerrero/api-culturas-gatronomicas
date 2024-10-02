import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { CountryService } from './country.service';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { CountryDto } from './country.dto';
import { plainToInstance } from 'class-transformer';
import { CountryEntity } from './country.entity';
import { RolesGuard } from '../roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { Roles } from '../roles.decorator';

@Controller('country')
@UseInterceptors(BusinessErrorsInterceptor)
@UseGuards(JwtAuthGuard, RolesGuard)
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Get()
  @Roles('reader')
  async findAll() {
    return await this.countryService.findAll();
  }

  @Get(':countryId')
  @Roles('reader', 'reader_single')
  async findOne(@Param('countryId') countryId: string) {
    return await this.countryService.findOne(countryId);
  }

  @Post()
  @Roles('writer', 'user')
  async create(@Body() countryDto: CountryDto) {
    const country: CountryEntity = plainToInstance(CountryEntity, countryDto);
    return await this.countryService.create(country);
  }

  @Put(':countryId')
  @Roles('writer', 'user')
  async update(@Param('countryId') countryId: string, @Body() countryDto: CountryDto) {
    const country: CountryEntity = plainToInstance(CountryEntity, countryDto);
    return await this.countryService.update(countryId, country);
  }

  @Delete(':countryId')
  @HttpCode(204)
  @Roles('deleter')
  async delete(@Param('countryId') countryId: string) {
    return await this.countryService.remove(countryId);
  }
}
