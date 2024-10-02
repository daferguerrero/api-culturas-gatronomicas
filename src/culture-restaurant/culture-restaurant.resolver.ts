import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { CultureRestaurantService } from './culture-restaurant.service';
import { CultureEntity } from 'src/culture/culture.entity/culture.entity';
import { RestaurantEntity } from 'src/restaurant/restaurant.entity/restaurant.entity';
import { RestaurantDto } from 'src/restaurant/restaurant.dto/restaurant.dto';
import { plainToInstance } from 'class-transformer';

@Resolver()
export class CultureRestaurantResolver {
    constructor(private cultureRestaurantService: CultureRestaurantService) {}

    @Mutation(() => CultureEntity)
    async addRestaurantToCulture(
      @Args('cultureId') cultureId: string,
      @Args('restaurantId') restaurantId: string,
    ): Promise<CultureEntity> {
      return await this.cultureRestaurantService.addRestaurantToCulture(cultureId, restaurantId);
    }
  
    @Query(() => RestaurantEntity)
    async findRestaurantByCultureIdRestaurantId(
      @Args('cultureId') cultureId: string,
      @Args('restaurantId') restaurantId: string,
    ): Promise<RestaurantEntity> {
      return await this.cultureRestaurantService.findRestaurantByCultureIdAndRestaurantId(
        cultureId,
        restaurantId,
      );
    }
  
    @Query(() => [RestaurantEntity])
    async findRestaurantsByCultureId(
      @Args('cultureId') cultureId: string,
    ): Promise<RestaurantEntity[]> {
      return await this.cultureRestaurantService.findRestaurantsByCultureId(cultureId);
    }
  
    @Mutation(() => [CultureEntity])
    async associateRestaurantsToCulture(
      @Args('restaurants', { type: () => [RestaurantDto] }) restaurantsDto: RestaurantDto[],
      @Args('cultureId') cultureId: string,
    ): Promise<CultureEntity> {
      const restaurants = plainToInstance(RestaurantEntity, restaurantsDto);
      return await this.cultureRestaurantService.associateRestaurantsToCulture(
        cultureId,
        restaurants,
      );
    }
  
    @Mutation(() => String)
    async deleteRestaurantFromCulture(
      @Args('cultureId') cultureId: string,
      @Args('restaurantId') restaurantId: string,
    ) {
      return await this.cultureRestaurantService.deleteRestaurantFromCulture(cultureId, restaurantId);
    }
}
