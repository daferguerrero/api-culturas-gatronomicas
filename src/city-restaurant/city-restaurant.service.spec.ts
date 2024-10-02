import { Test, TestingModule } from '@nestjs/testing';
import { CityRestaurantService } from './city-restaurant.service';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RestaurantEntity } from '../restaurant/restaurant.entity/restaurant.entity';
import { CityEntity } from '../city/city.entity';

describe('CityRestaurantService', () => {
  let service: CityRestaurantService;
  let cityRepository: Repository<CityEntity>;
  let restaurantRepository: Repository<RestaurantEntity>;
  let city: CityEntity;
  let restaurantList: RestaurantEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CityRestaurantService],
    }).compile();

    service = module.get<CityRestaurantService>(CityRestaurantService);
    cityRepository = module.get<Repository<CityEntity>>(getRepositoryToken(CityEntity));
    restaurantRepository = module.get<Repository<RestaurantEntity>>(getRepositoryToken(RestaurantEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    await restaurantRepository.clear();
    await cityRepository.clear();

    restaurantList = [];
    for (let i = 0; i < 5; i++) {
      const restaurant: RestaurantEntity = await restaurantRepository.save({
        name: faker.company.name(),
        michelinStars: faker.number.int({ min: 0, max: 3 }),
        achievementDate: faker.date.past().toString(),
        city: null,
      });
      restaurantList.push(restaurant);
    }

    city = await cityRepository.save({
      name: faker.location.city(),
      country: null,  // Puedes ajustar esto si la relación con País es necesaria
      restaurants: restaurantList,
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addRestaurantToCity should add a restaurant to a city', async () => {
    const newRestaurant: RestaurantEntity = await restaurantRepository.save({
      name: faker.company.name(),
      michelinStars: faker.number.int({ min: 0, max: 3 }),
      achievementDate: faker.date.past().toString(),
      city: null,
    });

    const newCity: CityEntity = await cityRepository.save({
      name: faker.location.city(),
      country: null,
    });

    const result: CityEntity = await service.addRestaurantToCity(newCity.id, newRestaurant.id);

    expect(result.restaurants.length).toBe(1);
    expect(result.restaurants[0]).not.toBeNull();
    expect(result.restaurants[0].name).toBe(newRestaurant.name);
  });

  it('addRestaurantToCity should throw an exception for an invalid restaurant', async () => {
    const newCity: CityEntity = await cityRepository.save({
      name: faker.location.city(),
      country: null,
    });

    await expect(() => service.addRestaurantToCity(newCity.id, "0")).rejects.toHaveProperty("message", "The restaurant with the given id was not found");
  });

  it('addRestaurantToCity should throw an exception for an invalid city', async () => {
    const newRestaurant: RestaurantEntity = await restaurantRepository.save({
      name: faker.company.name(),
      michelinStars: faker.number.int({ min: 0, max: 3 }),
      achievementDate: faker.date.past().toString(),
      city: null,
    });

    await expect(() => service.addRestaurantToCity("0", newRestaurant.id)).rejects.toHaveProperty("message", "The city with the given id was not found");
  });

  it('findRestaurantByCityIdAndRestaurantId should return restaurant by city', async () => {
    const restaurant: RestaurantEntity = restaurantList[0];
    const storedRestaurant: RestaurantEntity = await service.findRestaurantByCityIdAndRestaurantId(city.id, restaurant.id);
    expect(storedRestaurant).not.toBeNull();
    expect(storedRestaurant.name).toBe(restaurant.name);
  });

  it('findRestaurantByCityIdAndRestaurantId should throw an exception for an invalid restaurant', async () => {
    await expect(() => service.findRestaurantByCityIdAndRestaurantId(city.id, "0")).rejects.toHaveProperty("message", "The restaurant with the given id is not associated to the city");
  });

  it('findRestaurantByCityIdAndRestaurantId should throw an exception for an invalid city', async () => {
    const restaurant: RestaurantEntity = restaurantList[0];
    await expect(() => service.findRestaurantByCityIdAndRestaurantId("0", restaurant.id)).rejects.toHaveProperty("message", "The city with the given id was not found");
  });

  it('findRestaurantByCityIdAndRestaurantId should throw an exception for a restaurant not associated with the city', async () => {
    const newRestaurant: RestaurantEntity = await restaurantRepository.save({
      name: faker.company.name(),
      michelinStars: faker.number.int({ min: 0, max: 3 }),
      achievementDate: faker.date.past().toString(),
      city: null,
    });

    await expect(() => service.findRestaurantByCityIdAndRestaurantId(city.id, newRestaurant.id)).rejects.toHaveProperty("message", "The restaurant with the given id is not associated to the city");
  });

  it('findRestaurantsByCityId should return restaurants by city', async () => {
    const restaurants: RestaurantEntity[] = await service.findRestaurantsByCityId(city.id);
    expect(restaurants.length).toBe(5);
  });

  it('findRestaurantsByCityId should throw an exception for an invalid city', async () => {
    await expect(() => service.findRestaurantsByCityId("0")).rejects.toHaveProperty("message", "The city with the given id was not found");
  });

  it('associateRestaurantsToCity should update restaurants list for a city', async () => {
    const newRestaurant: RestaurantEntity = await restaurantRepository.save({
      name: faker.company.name(),
      michelinStars: faker.number.int({ min: 0, max: 3 }),
      achievementDate: faker.date.past().toString(),
      city: null,
    });

    const updatedCity: CityEntity = await service.associateRestaurantsToCity(city.id, [newRestaurant]);
    expect(updatedCity.restaurants.length).toBe(1);
    expect(updatedCity.restaurants[0].name).toBe(newRestaurant.name);
  });

  it('associateRestaurantsToCity should throw an exception for an invalid city', async () => {
    const newRestaurant: RestaurantEntity = await restaurantRepository.save({
      name: faker.company.name(),
      michelinStars: faker.number.int({ min: 0, max: 3 }),
      achievementDate: faker.date.past().toString(),
      city: null,
    });

    await expect(() => service.associateRestaurantsToCity("0", [newRestaurant])).rejects.toHaveProperty("message", "The city with the given id was not found");
  });

  it('associateRestaurantsToCity should throw an exception for an invalid restaurant', async () => {
    const newRestaurant: RestaurantEntity = restaurantList[0];
    newRestaurant.id = "0";

    await expect(() => service.associateRestaurantsToCity(city.id, [newRestaurant])).rejects.toHaveProperty("message", "The restaurant with the given id was not found");
  });

  it('deleteRestaurantFromCity should remove a restaurant from a city', async () => {
    const restaurant: RestaurantEntity = restaurantList[0];

    await service.deleteRestaurantFromCity(city.id, restaurant.id);

    const storedCity: CityEntity = await cityRepository.findOne({ where: { id: city.id }, relations: ["restaurants"] });
    const deletedRestaurant: RestaurantEntity = storedCity.restaurants.find(a => a.id === restaurant.id);

    expect(deletedRestaurant).toBeUndefined();
  });

  it('deleteRestaurantFromCity should throw an exception for an invalid restaurant', async () => {
    await expect(() => service.deleteRestaurantFromCity(city.id, "0")).rejects.toHaveProperty("message", "The restaurant with the given id is not associated to the city");
  });

  it('deleteRestaurantFromCity should throw an exception for an invalid city', async () => {
    const restaurant: RestaurantEntity = restaurantList[0];
    await expect(() => service.deleteRestaurantFromCity("0", restaurant.id)).rejects.toHaveProperty("message", "The city with the given id was not found");
  });

  it('deleteRestaurantFromCity should throw an exception for a non-associated restaurant', async () => {
    const newRestaurant: RestaurantEntity = await restaurantRepository.save({
      name: faker.company.name(),
      michelinStars: faker.number.int({ min: 0, max: 3 }),
      achievementDate: faker.date.past().toString(),
      city: null, 
    });

    await expect(() => service.deleteRestaurantFromCity(city.id, newRestaurant.id)).rejects.toHaveProperty("message", "The restaurant with the given id is not associated to the city");
  });
});

