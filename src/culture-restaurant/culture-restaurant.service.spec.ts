import { Test, TestingModule } from '@nestjs/testing';
import { CultureRestaurantService } from './culture-restaurant.service';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CultureEntity } from '../culture/culture.entity/culture.entity';
import { RestaurantEntity } from '../restaurant/restaurant.entity/restaurant.entity';

describe('CultureRestaurantService', () => {
  let service: CultureRestaurantService;
  let cultureRepository: Repository<CultureEntity>;
  let restaurantRepository: Repository<RestaurantEntity>;
  let culture: CultureEntity;
  let restaurantsList: RestaurantEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CultureRestaurantService],
    }).compile();

    service = module.get<CultureRestaurantService>(CultureRestaurantService);
    cultureRepository = module.get<Repository<CultureEntity>>(getRepositoryToken(CultureEntity));
    restaurantRepository = module.get<Repository<RestaurantEntity>>(getRepositoryToken(RestaurantEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    await restaurantRepository.clear();
    await cultureRepository.clear();

    restaurantsList = [];
    for(let i = 0; i < 5; i++){
      const restaurant: RestaurantEntity = await restaurantRepository.save({
        name: faker.company.name(),
        michelinStars: 0,
        achievementDate: faker.date.past().toString(),
        culture: null,
      });
      restaurantsList.push(restaurant);
    }

    culture = await cultureRepository.save({
      name: faker.company.name(),
      description: faker.lorem.sentence(),
      restaurants: restaurantsList,
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addRestaurantToCulture should add a restaurant to a culture', async () => {
    const newRestaurant: RestaurantEntity = await restaurantRepository.save({
      name: faker.company.name(),
      michelinStars: 0,
      achievementDate: faker.date.past().toString(),
      culture: null,
    });

    const newCulture: CultureEntity = await cultureRepository.save({
      name: faker.company.name(),
      description: faker.lorem.sentence(),
    });

    const result: CultureEntity = await service.addRestaurantToCulture(newCulture.id, newRestaurant.id);

    expect(result.restaurants.length).toBe(1);
    expect(result.restaurants[0]).not.toBeNull();
    expect(result.restaurants[0].name).toBe(newRestaurant.name);
  });

  it('addRestaurantToCulture should throw an exception for an invalid restaurant', async () => {
    const newCulture: CultureEntity = await cultureRepository.save({
      name: faker.company.name(),
      description: faker.lorem.sentence(),
    });

    await expect(() => service.addRestaurantToCulture(newCulture.id, "0")).rejects.toHaveProperty("message", "The restaurant with the given id was not found");
  });

  it('addRestaurantToCulture should throw an exception for an invalid culture', async () => {
    const newRestaurant: RestaurantEntity = await restaurantRepository.save({
      name: faker.company.name(),
      michelinStars: 0,
      achievementDate: faker.date.past().toString(),
      culture: null,
    });

    await expect(() => service.addRestaurantToCulture("0", newRestaurant.id)).rejects.toHaveProperty("message", "The culture with the given id was not found");
  });

  it('findRestaurantByCultureIdAndRestaurantId should return restaurant by culture', async () => {
    const restaurant: RestaurantEntity = restaurantsList[0];
    const storedRestaurant: RestaurantEntity = await service.findRestaurantByCultureIdAndRestaurantId(culture.id, restaurant.id);
    expect(storedRestaurant).not.toBeNull();
    expect(storedRestaurant.name).toBe(restaurant.name);
  });

  it('findRestaurantByCultureIdAndRestaurantId should throw an exception for an invalid restaurant', async () => {
    await expect(() => service.findRestaurantByCultureIdAndRestaurantId(culture.id, "0")).rejects.toHaveProperty("message", "The restaurant with the given id was not found");
  });

  it('findRestaurantByCultureIdAndRestaurantId should throw an exception for an invalid culture', async () => {
    const restaurant: RestaurantEntity = restaurantsList[0];
    await expect(() => service.findRestaurantByCultureIdAndRestaurantId("0", restaurant.id)).rejects.toHaveProperty("message", "The culture with the given id was not found");
  });

  it('findRestaurantByCultureIdAndRestaurantId should throw an exception for a restaurant not associated with the culture', async () => {
    const newRestaurant: RestaurantEntity = await restaurantRepository.save({
      name: faker.company.name(),
      michelinStars: 0,
      achievementDate: faker.date.past().toString(),
      culture: null,
    });

    await expect(() => service.findRestaurantByCultureIdAndRestaurantId(culture.id, newRestaurant.id)).rejects.toHaveProperty("message", "The restaurant with the given id is not associated to the culture");
  });

  it('findRestaurantsByCultureId should return restaurants by culture', async () => {
    const restaurants: RestaurantEntity[] = await service.findRestaurantsByCultureId(culture.id);
    expect(restaurants.length).toBe(5);
  });

  it('findRestaurantsByCultureId should throw an exception for an invalid culture', async () => {
    await expect(() => service.findRestaurantsByCultureId("0")).rejects.toHaveProperty("message", "The culture with the given id was not found");
  });

  it('associateRestaurantsToCulture should update restaurants list for a culture', async () => {
    const newRestaurant: RestaurantEntity = await restaurantRepository.save({
      name: faker.company.name(),
      michelinStars: 0,
      achievementDate: faker.date.past().toString(),
      culture: null,
    });

    const updatedCulture: CultureEntity = await service.associateRestaurantsToCulture(culture.id, [newRestaurant]);
    expect(updatedCulture.restaurants.length).toBe(1);
    expect(updatedCulture.restaurants[0].name).toBe(newRestaurant.name);
  });

  it('associateRestaurantsToCulture should throw an exception for an invalid culture', async () => {
    const newRestaurant: RestaurantEntity = await restaurantRepository.save({
      name: faker.company.name(),
      michelinStars: 0,
      achievementDate: faker.date.past().toString(),
      culture: null,
    });

    await expect(() => service.associateRestaurantsToCulture("0", [newRestaurant])).rejects.toHaveProperty("message", "The culture with the given id was not found");
  });

  it('associateRestaurantsToCulture should throw an exception for an invalid restaurant', async () => {
    const newRestaurant: RestaurantEntity = restaurantsList[0];
    newRestaurant.id = "0";

    await expect(() => service.associateRestaurantsToCulture(culture.id, [newRestaurant])).rejects.toHaveProperty("message", "The restaurant with the given id was not found");
  });

  it('deleteRestaurantFromCulture should remove a restaurant from a culture', async () => {
    const restaurant: RestaurantEntity = restaurantsList[0];

    await service.deleteRestaurantFromCulture(culture.id, restaurant.id);

    const storedCulture: CultureEntity = await cultureRepository.findOne({ where: { id: culture.id }, relations: ["restaurants"] });
    const deletedRestaurant: RestaurantEntity = storedCulture.restaurants.find(a => a.id === restaurant.id);

    expect(deletedRestaurant).toBeUndefined();
  });

  it('deleteRestaurantFromCulture should throw an exception for an invalid restaurant', async () => {
    await expect(() => service.deleteRestaurantFromCulture(culture.id, "0")).rejects.toHaveProperty("message", "The restaurant with the given id was not found");
  });

  it('deleteRestaurantFromCulture should throw an exception for an invalid culture', async () => {
    const restaurant: RestaurantEntity = restaurantsList[0];
    await expect(() => service.deleteRestaurantFromCulture("0", restaurant.id)).rejects.toHaveProperty("message", "The culture with the given id was not found");
  });

  it('deleteRestaurantFromCulture should throw an exception for a non-associated restaurant', async () => {
    const newRestaurant: RestaurantEntity = await restaurantRepository.save({
      name: faker.company.name(),
      michelinStars: 0,
      achievementDate: faker.date.past().toString(),
      culture: null, 
    });

    await expect(() => service.deleteRestaurantFromCulture(culture.id, newRestaurant.id)).rejects.toHaveProperty("message", "The restaurant with the given id is not associated to the culture");
  });
});

