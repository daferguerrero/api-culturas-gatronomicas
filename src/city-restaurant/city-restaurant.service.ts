import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RestaurantEntity } from '../restaurant/restaurant.entity/restaurant.entity';
import { CityEntity } from '../city/city.entity';

@Injectable()
export class CityRestaurantService {
  constructor(
    @InjectRepository(CityEntity)
    private readonly cityRepository: Repository<CityEntity>,

    @InjectRepository(RestaurantEntity)
    private readonly restaurantRepository: Repository<RestaurantEntity>,
  ) {}

  async addRestaurantToCity(cityId: string, restaurantId: string): Promise<CityEntity> {
    const city = await this.cityRepository.findOne({ where: { id: cityId }, relations: ['restaurants'] });
    if (!city) {
      throw new NotFoundException('The city with the given id was not found');
    }

    const restaurant = await this.restaurantRepository.findOne({ where: { id: restaurantId } });
    if (!restaurant) {
      throw new NotFoundException('The restaurant with the given id was not found');
    }

    city.restaurants.push(restaurant);
    return this.cityRepository.save(city);
  }

  async findRestaurantByCityIdAndRestaurantId(cityId: string, restaurantId: string): Promise<RestaurantEntity> {
    const city = await this.cityRepository.findOne({ where: { id: cityId }, relations: ['restaurants'] });
    if (!city) {
      throw new NotFoundException('The city with the given id was not found');
    }

    const restaurant = city.restaurants.find(restaurant => restaurant.id === restaurantId);
    if (!restaurant) {
      throw new NotFoundException('The restaurant with the given id is not associated to the city');
    }

    return restaurant;
  }

  async findRestaurantsByCityId(cityId: string): Promise<RestaurantEntity[]> {
    const city = await this.cityRepository.findOne({ where: { id: cityId }, relations: ['restaurants'] });
    if (!city) {
      throw new NotFoundException('The city with the given id was not found');
    }

    return city.restaurants;
  }

  async associateRestaurantsToCity(cityId: string, restaurants: RestaurantEntity[]): Promise<CityEntity> {
    const city = await this.cityRepository.findOne({ where: { id: cityId }, relations: ['restaurants'] });
    if (!city) {
      throw new NotFoundException('The city with the given id was not found');
    }

    for (const restaurant of restaurants) {
      const foundRestaurant = await this.restaurantRepository.findOne({ where: { id: restaurant.id } });
      if (!foundRestaurant) {
        throw new NotFoundException('The restaurant with the given id was not found');
      }
    }

    city.restaurants = restaurants;
    return this.cityRepository.save(city);
  }

  async deleteRestaurantFromCity(cityId: string, restaurantId: string): Promise<void> {
    const city = await this.cityRepository.findOne({ where: { id: cityId }, relations: ['restaurants'] });
    if (!city) {
      throw new NotFoundException('The city with the given id was not found');
    }

    const restaurantIndex = city.restaurants.findIndex(restaurant => restaurant.id === restaurantId);
    if (restaurantIndex === -1) {
      throw new NotFoundException('The restaurant with the given id is not associated to the city');
    }

    const restaurant: RestaurantEntity = city.restaurants[restaurantIndex];
    restaurant.city = null; 
    await this.restaurantRepository.save(restaurant);

    city.restaurants.splice(restaurantIndex, 1); 
    await this.cityRepository.save(city);
  }
}
