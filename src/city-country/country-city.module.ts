import { Module } from '@nestjs/common';
import { CountryCityService } from './country-city.service';
import { CountryEntity } from '../country/country.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CityEntity } from '../city/city.entity';
import { CountryCityController } from './country-city.controller';
import { CountryCityResolver } from './country-city.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([CountryEntity, CityEntity])],
  providers: [CountryCityService, CountryCityResolver],
  controllers: [CountryCityController]
})
export class CountryCityModule {}
