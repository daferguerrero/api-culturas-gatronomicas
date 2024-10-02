import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { CountryCityService } from './country-city.service';
import { CountryEntity } from '../country/country.entity';
import { CityEntity } from '../city/city.entity';
import { CityDto } from '../city/city.dto';
import { plainToInstance } from 'class-transformer';

@Resolver()
export class CountryCityResolver {
  constructor(private countryCityService: CountryCityService) {}

  @Mutation(() => CountryEntity)
  async addCityCountry(
    @Args('countryId') countryId: string,
    @Args('cityId') cityId: string,
  ): Promise<CountryEntity> {
    return await this.countryCityService.addCityCountry(countryId, cityId);
  }

  @Query(() => CityEntity)
  async findCityByCountryIdCityId(
    @Args('countryId') countryId: string,
    @Args('cityId') cityId: string,
  ): Promise<CityEntity> {
    return await this.countryCityService.findCityByCountryIdCityId(
      countryId,
      cityId,
    );
  }

  @Query(() => [CityEntity])
  async findCitiesByCountryId(
    @Args('countryId') countryId: string,
  ): Promise<CityEntity[]> {
    return await this.countryCityService.findCitiesByCountryId(countryId);
  }

  @Mutation(() => [CountryEntity])
  async associateCitiesCountry(
    @Args('cities', { type: () => [CityDto] }) citiesDto: CityDto[],
    @Args('countryId') countryId: string,
  ): Promise<CountryEntity> {
    const cities = plainToInstance(CityEntity, citiesDto);
    return await this.countryCityService.associateCitiesCountry(
      countryId,
      cities,
    );
  }

  @Mutation(() => String)
  async deleteCityCountry(
    @Args('countryId') countryId: string,
    @Args('cityId') cityId: string,
  ) {
    return await this.countryCityService.deleteCityCountry(countryId, cityId);
  }
}
