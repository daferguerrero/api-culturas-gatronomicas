import { Test, TestingModule } from '@nestjs/testing';
import { CountryService } from './country.service';
import { Repository } from 'typeorm';
import { CountryEntity } from './country.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { CacheModule } from '@nestjs/cache-manager';

describe('CountryService', () => {
  let service: CountryService;
  let repository: Repository<CountryEntity>;
  let countryList: CountryEntity[] = [];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig(),  CacheModule.register()],
      providers: [CountryService],
    }).compile();

    service = module.get<CountryService>(CountryService);
    repository = module.get<Repository<CountryEntity>>(
      getRepositoryToken(CountryEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    await repository.clear();
    countryList = [];
    for (let i = 0; i < 5; i++) {
      const country: CountryEntity = await repository.save({
        name: faker.company.name(),
      });
      countryList.push(country);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all countries', async () => {
    const countries: CountryEntity[] = await service.findAll();
    expect(countries).not.toBeNull();
    expect(countries).toHaveLength(countryList.length);
  });

  it('findOne should return a country by id', async () => {
    const storedCountry: CountryEntity = countryList[0];
    const country: CountryEntity = await service.findOne(storedCountry.id);
    expect(country).not.toBeNull();
    expect(country.name).toEqual(storedCountry.name);
  });

  it('findOne should throw an exception for an invalid country', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'The country with the given id was not found',
    );
  });

  it('create should return a new country', async () => {
    const country: CountryEntity = {
      id: '',
      name: faker.company.name(),
      cities: [],
    };

    const newCountry: CountryEntity = await service.create(country);
    expect(newCountry).not.toBeNull();

    const storedMuseum: CountryEntity = await repository.findOne({
      where: { id: newCountry.id },
    });
    expect(storedMuseum).not.toBeNull();
    expect(storedMuseum.name).toEqual(newCountry.name);
  });

  it('update should modify a country', async () => {
    const country: CountryEntity = countryList[0];
    country.name = 'New name';
    const updatedCountry: CountryEntity = await service.update(country.id, country);
    expect(updatedCountry).not.toBeNull();
    const storedCountry: CountryEntity = await repository.findOne({
      where: { id: country.id },
    });
    expect(storedCountry).not.toBeNull();
    expect(storedCountry.name).toEqual(country.name);
  });

  it('update should throw an exception for an invalid country', async () => {
    let country: CountryEntity = countryList[0];
    country = {
      ...country,
      name: 'New name',
    };
    await expect(() => service.update('0', country)).rejects.toHaveProperty(
      'message',
      'The country with the given id was not found',
    );
  });

  it('delete should remove a country', async () => {
    const country: CountryEntity = countryList[0];
    await service.remove(country.id);
    const deletedCountry: CountryEntity = await repository.findOne({
      where: { id: country.id },
    });
    expect(deletedCountry).toBeNull();
  });

  it('delete should throw an exception for an invalid country', async () => {
    await expect(() => service.remove('0')).rejects.toHaveProperty(
      'message',
      'The country with the given id was not found',
    );
  });
});
