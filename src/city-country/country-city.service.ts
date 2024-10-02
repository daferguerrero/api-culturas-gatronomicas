import { Injectable } from '@nestjs/common';
import { CountryEntity } from '../country/country.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CityEntity } from '../city/city.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class CountryCityService {
  constructor(
    @InjectRepository(CountryEntity)
    private readonly countryRepository: Repository<CountryEntity>,

    @InjectRepository(CityEntity)
    private readonly cityRepository: Repository<CityEntity>
  ) {}

  async addCityCountry(countryId: string, cityId: string): Promise<CountryEntity> {
    const city: CityEntity = await this.cityRepository.findOne({where: {id: cityId}});
    if (!city)
      throw new BusinessLogicException("The city with the given id was not found", BusinessError.NOT_FOUND);

    const country: CountryEntity = await this.countryRepository.findOne( {where: {id: countryId}, relations: ["cities"] })
    if (!country)
      throw new BusinessLogicException("The country with the given id was not found", BusinessError.NOT_FOUND);

    country.cities = [...country.cities, city];
    return await this.countryRepository.save(country);
  }

  async findCityByCountryIdCityId(countryId: string, cityId: string): Promise<CityEntity> {
    const city: CityEntity = await this.cityRepository.findOne({where: {id: cityId}});
    if (!city)
      throw new BusinessLogicException("The city with the given id was not found", BusinessError.NOT_FOUND)

    const country: CountryEntity = await this.countryRepository.findOne({where: {id: countryId}, relations: ["cities"]});
    if (!country)
      throw new BusinessLogicException("The country with the given id was not found", BusinessError.NOT_FOUND)

    const countryCity: CityEntity = country.cities.find(e => e.id === city.id);

    if (!countryCity)
      throw new BusinessLogicException("The city with the given id is not associated to the country", BusinessError.PRECONDITION_FAILED)

    return countryCity;
  }

  async findCitiesByCountryId(countryId: string): Promise<CityEntity[]> {
    const country: CountryEntity = await this.countryRepository.findOne({where: {id: countryId}, relations: ["cities"]});
    if (!country)
      throw new BusinessLogicException("The country with the given id was not found", BusinessError.NOT_FOUND)

    return country.cities;
  }

  async associateCitiesCountry(countryId: string, cities: CityEntity[]): Promise<CountryEntity> {
    const country: CountryEntity = await this.countryRepository.findOne({where: {id: countryId}, relations: ["cities"]});

    if (!country)
      throw new BusinessLogicException("The country with the given id was not found", BusinessError.NOT_FOUND)

    for (let i = 0; i < cities.length; i++) {
      const city: CityEntity = await this.cityRepository.findOne({where: {id: cities[i].id}});
      if (!city)
        throw new BusinessLogicException("The city with the given id was not found", BusinessError.NOT_FOUND)
    }

    country.cities = cities;
    return await this.countryRepository.save(country);
  }

  async deleteCityCountry(countryId: string, cityId: string){
    const city: CityEntity = await this.cityRepository.findOne({where: {id: cityId}});
    if (!city)
      throw new BusinessLogicException("The city with the given id was not found", BusinessError.NOT_FOUND)

    const country: CountryEntity = await this.countryRepository.findOne({where: {id: countryId}, relations: ["cities"]});
    if (!country)
      throw new BusinessLogicException("The country with the given id was not found", BusinessError.NOT_FOUND)

    const countryCity: CityEntity = country.cities.find(e => e.id === city.id);

    if (!countryCity)
      throw new BusinessLogicException("The city with the given id is not associated to the country", BusinessError.PRECONDITION_FAILED)

    country.cities = country.cities.filter(e => e.id !== cityId);
    await this.countryRepository.save(country);
  }
}
