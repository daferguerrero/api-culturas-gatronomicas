import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { CultureEntity } from '../culture/culture.entity/culture.entity';
import { RestaurantEntity } from '../restaurant/restaurant.entity/restaurant.entity';

@Injectable()
export class CultureRestaurantService {
  constructor(
    @InjectRepository(CultureEntity)
    private readonly cultureRepository: Repository<CultureEntity>,

    @InjectRepository(RestaurantEntity)
    private readonly restaurantRepository: Repository<RestaurantEntity>
  ) {}

  async addRestaurantToCulture(cultureId: string, restaurantId: string): Promise<CultureEntity> {
    const restaurant: RestaurantEntity = await this.restaurantRepository.findOne({ where: { id: restaurantId } });
    if (!restaurant)
      throw new BusinessLogicException("The restaurant with the given id was not found", BusinessError.NOT_FOUND);

    const culture: CultureEntity = await this.cultureRepository.findOne({ where: { id: cultureId }, relations: ["restaurants"] });
    if (!culture)
      throw new BusinessLogicException("The culture with the given id was not found", BusinessError.NOT_FOUND);

    culture.restaurants = [...culture.restaurants, restaurant];
    return await this.cultureRepository.save(culture);
  }

  async findRestaurantByCultureIdAndRestaurantId(cultureId: string, restaurantId: string): Promise<RestaurantEntity> {
    const restaurant: RestaurantEntity = await this.restaurantRepository.findOne({ where: { id: restaurantId } });
    if (!restaurant)
      throw new BusinessLogicException("The restaurant with the given id was not found", BusinessError.NOT_FOUND);

    const culture: CultureEntity = await this.cultureRepository.findOne({ where: { id: cultureId }, relations: ["restaurants"] });
    if (!culture)
      throw new BusinessLogicException("The culture with the given id was not found", BusinessError.NOT_FOUND);

    const cultureRestaurant: RestaurantEntity = culture.restaurants.find(e => e.id === restaurant.id);

    if (!cultureRestaurant)
      throw new BusinessLogicException("The restaurant with the given id is not associated to the culture", BusinessError.PRECONDITION_FAILED);

    return cultureRestaurant;
  }

  async findRestaurantsByCultureId(cultureId: string): Promise<RestaurantEntity[]> {
    const culture: CultureEntity = await this.cultureRepository.findOne({ where: { id: cultureId }, relations: ["restaurants"] });
    if (!culture)
      throw new BusinessLogicException("The culture with the given id was not found", BusinessError.NOT_FOUND);

    return culture.restaurants;
  }

  async associateRestaurantsToCulture(cultureId: string, restaurants: RestaurantEntity[]): Promise<CultureEntity> {
    const culture: CultureEntity = await this.cultureRepository.findOne({ where: { id: cultureId }, relations: ["restaurants"] });

    if (!culture)
      throw new BusinessLogicException("The culture with the given id was not found", BusinessError.NOT_FOUND);

    for (let i = 0; i < restaurants.length; i++) {
      const restaurant: RestaurantEntity = await this.restaurantRepository.findOne({ where: { id: restaurants[i].id } });
      if (!restaurant)
        throw new BusinessLogicException("The restaurant with the given id was not found", BusinessError.NOT_FOUND);
    }

    culture.restaurants = restaurants;
    return await this.cultureRepository.save(culture);
  }

  async deleteRestaurantFromCulture(cultureId: string, restaurantId: string) {
    const restaurant: RestaurantEntity = await this.restaurantRepository.findOne({ where: { id: restaurantId } });
    if (!restaurant)
      throw new BusinessLogicException("The restaurant with the given id was not found", BusinessError.NOT_FOUND);

    const culture: CultureEntity = await this.cultureRepository.findOne({ where: { id: cultureId }, relations: ["restaurants"] });
    if (!culture)
      throw new BusinessLogicException("The culture with the given id was not found", BusinessError.NOT_FOUND);

    const cultureRestaurant: RestaurantEntity = culture.restaurants.find(e => e.id === restaurant.id);

    if (!cultureRestaurant)
      throw new BusinessLogicException("The restaurant with the given id is not associated to the culture", BusinessError.PRECONDITION_FAILED);

    culture.restaurants = culture.restaurants.filter(e => e.id !== restaurantId);
    await this.cultureRepository.save(culture);
  }
}
