import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { CountryCityService } from './country-city.service';
import { plainToInstance } from 'class-transformer';
import { CityDto } from '../city/city.dto';
import { CityEntity } from '../city/city.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from '../roles.guard';
import { Roles } from '../roles.decorator';

@Controller('countries')
@UseInterceptors(BusinessErrorsInterceptor)
@UseGuards(JwtAuthGuard, RolesGuard)
export class CountryCityController {
  constructor(private readonly countryCityService: CountryCityService){}

  @Post(':countryId/cities/:cityId')
  @Roles('writer')
  async addCityCountry(@Param('countryId') countryId: string, @Param('cityId') cityId: string){
    return await this.countryCityService.addCityCountry(countryId, cityId);
  }

  @Get(':countryId/cities/:cityId')
  @Roles('reader','reader_single')
  async findCityByCountryIdCityId(@Param('countryId') countryId: string, @Param('cityId') cityId: string){
    return await this.countryCityService.findCityByCountryIdCityId(countryId, cityId);
  }

  @Get(':countryId/cities')
  @Roles('reader')
  async findCitiesByCountryId(@Param('countryId') countryId: string){
    return await this.countryCityService.findCitiesByCountryId(countryId);
  }

  @Put(':countryId/cities')
  @Roles('writer')
  async associateCitiesCountry(@Body() citiesDto: CityDto[], @Param('countryId') countryId: string){
    const cities = plainToInstance(CityEntity, citiesDto)
    return await this.countryCityService.associateCitiesCountry(countryId, cities);
  }

  @Delete(':countryId/cities/:cityId')
  @HttpCode(204)
  @Roles('deleter')
  async deleteCityCountry(@Param('countryId') countryId: string, @Param('cityId') cityId: string){
    return await this.countryCityService.deleteCityCountry(countryId, cityId);
  }
}
