import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CityRestaurantService } from './city-restaurant.service';
import { CityEntity } from 'src/city/city.entity';
import { RestaurantEntity } from 'src/restaurant/restaurant.entity/restaurant.entity';
import { RestaurantDto } from 'src/restaurant/restaurant.dto/restaurant.dto';
import { plainToInstance } from 'class-transformer';

@Resolver()
export class CityRestaurantResolver {
    
    constructor(private cityRestaurantService: CityRestaurantService) {}


    @Mutation(() => CityEntity)
    async addRestaurantToCity(
      @Args('cityId') cityId: string,
      @Args('restaurantId') restaurantId: string,
    ): Promise<CityEntity> {
      return await this.cityRestaurantService.addRestaurantToCity(cityId, restaurantId);
    }


    @Query(() => RestaurantEntity)
    async findRestaurantByCityIdAndRestaurantId(
        @Args('cityId') cityId: string,
        @Args('restaurantId') restaurantId: string,
    ): Promise<RestaurantEntity> {
      return await this.cityRestaurantService.findRestaurantByCityIdAndRestaurantId(cityId, restaurantId);
    }

    
    @Query(() => [RestaurantEntity])
    async findRestaurantsByCityId(
        @Args('cityId') cityId: string,
    ): Promise<RestaurantEntity[]> {
      return await this.cityRestaurantService.findRestaurantsByCityId(cityId);
    }

    
    @Mutation(() => CityEntity)
    async associateRestaurantsToCity(
      @Args('recipes', { type: () => [RestaurantDto] }) restaurantDto: RestaurantDto[],
      @Args('cityId') cityId: string,
    ): Promise<CityEntity> {
      const restaurants = plainToInstance(RestaurantEntity, restaurantDto);
      return await this.cityRestaurantService.associateRestaurantsToCity(
        cityId,
        restaurants,
      );
    }

    @Mutation(() => String)
    async deleteRestaurantFromCity(
        @Args('cityId') cityId: string,
        @Args('restaurantId') restaurantId: string,
    ) {
      return await this.cityRestaurantService.deleteRestaurantFromCity(cityId, restaurantId);
    }

}
