import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RestaurantEntity } from './restaurant.entity/restaurant.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import {
    BusinessLogicException,
    BusinessError,
} from '../shared/errors/business-errors';

@Injectable()
export class RestaurantService {

    cacheKey: string = "restaurants";

    constructor(
        @InjectRepository(RestaurantEntity)
        private readonly restaurantRepository: Repository<RestaurantEntity>,

        @Inject(CACHE_MANAGER)
        private readonly cacheManager: Cache
    ) {}

    async findAll(): Promise<RestaurantEntity[]> {

        const cached: RestaurantEntity[] = await this.cacheManager.get<RestaurantEntity[]>(this.cacheKey);

        if(!cached){
            const restaurants: RestaurantEntity[] = await this.restaurantRepository.find({ relations: ["culture"] });
            await this.cacheManager.set(this.cacheKey, restaurants);
            return restaurants;
        }

        return cached;
    }

    async findOne(id: string): Promise<RestaurantEntity> {
        const restaurant: RestaurantEntity = await this.restaurantRepository.findOne({
            where: { id },
            relations: ["culture"],
        });
        if (!restaurant)
            throw new BusinessLogicException("The restaurant with the given id was not found", BusinessError.NOT_FOUND);

        return restaurant;
    }

    async create(restaurant: RestaurantEntity): Promise<RestaurantEntity> {
        return await this.restaurantRepository.save(restaurant);
    }

    async update(id: string, restaurant: RestaurantEntity): Promise<RestaurantEntity> {
        const persistedRestaurant: RestaurantEntity = await this.restaurantRepository.findOne({ where: { id } });
        if (!persistedRestaurant)
            throw new BusinessLogicException("The restaurant with the given id was not found", BusinessError.NOT_FOUND);

        return await this.restaurantRepository.save({ ...persistedRestaurant, ...restaurant });
    }

    async delete(id: string) {
        const restaurant: RestaurantEntity = await this.restaurantRepository.findOne({ where: { id } });
        if (!restaurant)
            throw new BusinessLogicException("The restaurant with the given id was not found", BusinessError.NOT_FOUND);

        await this.restaurantRepository.remove(restaurant);
    }
}
