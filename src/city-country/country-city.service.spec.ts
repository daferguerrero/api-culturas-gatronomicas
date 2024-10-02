import { Test, TestingModule } from '@nestjs/testing';
import { CountryCityService } from './country-city.service';
import { Repository } from 'typeorm';
import { CountryEntity } from '../country/country.entity';
import { CityEntity } from '../city/city.entity';
import { faker } from '@faker-js/faker';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('CountryCityService', () => {
  let service: CountryCityService;
  let countryRepository: Repository<CountryEntity>;
  let cityRepository: Repository<CityEntity>;
  let country: CountryEntity;
  let citiesList: CityEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CountryCityService],
    }).compile();

    service = module.get<CountryCityService>(CountryCityService);
    countryRepository = module.get<Repository<CountryEntity>>(getRepositoryToken(CountryEntity));
    cityRepository = module.get<Repository<CityEntity>>(getRepositoryToken(CityEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    await cityRepository.clear();
    await countryRepository.clear();

    citiesList = [];
    for(let i = 0; i < 5; i++){
      const city: CityEntity = await cityRepository.save({
        name: faker.company.name(),
      })
      citiesList.push(city);
    }

    country = await countryRepository.save({
      name: faker.company.name(),
      cities: citiesList
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addCityCountry should add an city to a country', async () => {
    const newCity: CityEntity = await cityRepository.save({
      name: faker.company.name(),
    });

    const newCountry: CountryEntity = await countryRepository.save({
      name: faker.company.name(),
    })

    const result: CountryEntity = await service.addCityCountry(newCountry.id, newCity.id);

    expect(result.cities.length).toBe(1);
    expect(result.cities[0]).not.toBeNull();
    expect(result.cities[0].name).toBe(newCity.name)
  });

  it('addCityCountry should thrown exception for an invalid city', async () => {
    const newCountry: CountryEntity = await countryRepository.save({
      name: faker.company.name(),
    })

    await expect(() => service.addCityCountry(newCountry.id, "0")).rejects.toHaveProperty("message", "The city with the given id was not found");
  });

  it('addCityCountry should throw an exception for an invalid country', async () => {
    const newCity: CityEntity = await cityRepository.save({
      name: faker.company.name(),
    });

    await expect(() => service.addCityCountry("0", newCity.id)).rejects.toHaveProperty("message", "The country with the given id was not found");
  });

  it('findCityByCountryIdCityId should return city by country', async () => {
    const city: CityEntity = citiesList[0];
    const storedCity: CityEntity = await service.findCityByCountryIdCityId(country.id, city.id, )
    expect(storedCity).not.toBeNull();
    expect(storedCity.name).toBe(city.name);
  });

  it('findCityByCountryIdCityId should throw an exception for an invalid city', async () => {
    await expect(()=> service.findCityByCountryIdCityId(country.id, "0")).rejects.toHaveProperty("message", "The city with the given id was not found");
  });

  it('findCityByCountryIdCityId should throw an exception for an invalid country', async () => {
    const city: CityEntity = citiesList[0];
    await expect(()=> service.findCityByCountryIdCityId("0", city.id)).rejects.toHaveProperty("message", "The country with the given id was not found");
  });

  it('findCityByCountryIdCityId should throw an exception for an city not associated to the country', async () => {
    const newCity: CityEntity = await cityRepository.save({
      name: faker.company.name(),
    });

    await expect(()=> service.findCityByCountryIdCityId(country.id, newCity.id)).rejects.toHaveProperty("message", "The city with the given id is not associated to the country");
  });

  it('findCitiesByCountryId should return artworks by country', async ()=>{
    const cities: CityEntity[] = await service.findCitiesByCountryId(country.id);
    expect(cities.length).toBe(5)
  });

  it('findCitiesByCountryId should throw an exception for an invalid country', async () => {
    await expect(()=> service.findCitiesByCountryId("0")).rejects.toHaveProperty("message", "The country with the given id was not found");
  });

  it('associateCitiesCountry should update artworks list for a country', async () => {
    const newCity: CityEntity = await cityRepository.save({
      name: faker.company.name(),
    });

    const updatedCountry: CountryEntity = await service.associateCitiesCountry(country.id, [newCity]);
    expect(updatedCountry.cities.length).toBe(1);

    expect(updatedCountry.cities[0].name).toBe(newCity.name);
  });

  it('associateCitiesCountry should throw an exception for an invalid country', async () => {
    const newCity: CityEntity = await cityRepository.save({
      name: faker.company.name(),
    });

    await expect(()=> service.associateCitiesCountry("0", [newCity])).rejects.toHaveProperty("message", "The country with the given id was not found");
  });

  it('associateCitiesCountry should throw an exception for an invalid city', async () => {
    const newCity: CityEntity = citiesList[0];
    newCity.id = "0";

    await expect(()=> service.associateCitiesCountry(country.id, [newCity])).rejects.toHaveProperty("message", "The city with the given id was not found");
  });

  it('deleteCityCountry should remove an city from a country', async () => {
    const city: CityEntity = citiesList[0];

    await service.deleteCityCountry(country.id, city.id);

    const storedCountry: CountryEntity = await countryRepository.findOne({where: {id: country.id}, relations: ["cities"]});
    const deletedCity: CityEntity = storedCountry.cities.find(a => a.id === city.id);

    expect(deletedCity).toBeUndefined();

  });

  it('deleteCityCountry should thrown an exception for an invalid city', async () => {
    await expect(()=> service.deleteCityCountry(country.id, "0")).rejects.toHaveProperty("message", "The city with the given id was not found");
  });

  it('deleteCityCountry should thrown an exception for an invalid country', async () => {
    const city: CityEntity = citiesList[0];
    await expect(()=> service.deleteCityCountry("0", city.id)).rejects.toHaveProperty("message", "The country with the given id was not found");
  });

  it('deleteCityCountry should thrown an exception for an non asocciated city', async () => {
    const newCity: CityEntity = await cityRepository.save({
      name: faker.company.name(),
    });

    await expect(()=> service.deleteCityCountry(country.id, newCity.id)).rejects.toHaveProperty("message", "The city with the given id is not associated to the country");
  });
});
