import { Test, TestingModule } from '@nestjs/testing';
import { CityService } from './city.service';
import { CityEntity } from './city.entity';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { CacheModule } from '@nestjs/cache-manager';

describe('CityService', () => {
  let service: CityService;
  let repository: Repository<CityEntity>;
  let cityList: CityEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig(), CacheModule.register()],
      providers: [CityService],
    }).compile();

    service = module.get<CityService>(CityService);
    repository = module.get<Repository<CityEntity>>(
      getRepositoryToken(CityEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    await repository.clear();
    cityList = [];
    for (let i = 0; i < 5; i++) {
      const city: CityEntity = await repository.save({
        name: faker.company.name(),
      });
      cityList.push(city);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all cities', async () => {
    const cities: CityEntity[] = await service.findAll();
    expect(cities).not.toBeNull();
    expect(cities).toHaveLength(cityList.length);
  });

  it('findOne should return a city by id', async () => {
    const storedCity: CityEntity = cityList[0];
    const city: CityEntity = await service.findOne(storedCity.id);
    expect(city).not.toBeNull();
    expect(city.name).toEqual(storedCity.name);
  });

  it('findOne should throw an exception for an invalid city', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'The city with the given id was not found',
    );
  });

  it('create should return a new city', async () => {
    const city: CityEntity = {
      id: '',
      name: faker.company.name(),
      country: null,
      restaurants: null
    };

    const newCity: CityEntity = await service.create(city);
    expect(newCity).not.toBeNull();

    const storedCity: CityEntity = await repository.findOne({
      where: { id: newCity.id },
    });
    expect(storedCity).not.toBeNull();
    expect(storedCity.name).toEqual(newCity.name);
  });

  it('update should return an updated city', async () => {
    const city: CityEntity = cityList[0];
    city.name = "new name";
    const updatedCity: CityEntity = await service.update(city.id, city);
    expect(updatedCity).not.toBeNull();
    const storedCity: CityEntity = await repository.findOne({
      where: { id: city.id },
    });
    expect(storedCity).not.toBeNull();
    expect(storedCity.name).toEqual(city.name);
  });

  it('update should throw an exception for an invalid city', async () => {
    let city: CityEntity = cityList[0];
    city = {
      ...city,
      name: 'New name',
    };
    await expect(() => service.update('0', city)).rejects.toHaveProperty(
      'message',
      'The city with the given id was not found',
    );
  });

  it('delete should remove a city', async () => {
    const city: CityEntity = cityList[0];
    await service.remove(city.id);
    const deletedCity: CityEntity = await repository.findOne({
      where: { id: city.id },
    });
    expect(deletedCity).toBeNull();
  });

  it('delete should throw an exception for an invalid country', async () => {
    await expect(() => service.remove('0')).rejects.toHaveProperty(
      'message',
      'The city with the given id was not found',
    );
  });
});
