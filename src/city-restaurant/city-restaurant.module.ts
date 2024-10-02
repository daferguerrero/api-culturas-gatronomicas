import { Module } from '@nestjs/common';
import { CityRestaurantService } from './city-restaurant.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CityEntity } from '../city/city.entity';
import { RestaurantEntity } from '../restaurant/restaurant.entity/restaurant.entity';
import { CityRestaurantController } from './city-restaurant.controller';
import { CityRestaurantResolver } from './city-restaurant.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([CityEntity, RestaurantEntity])],
  providers: [CityRestaurantService, CityRestaurantResolver],
  controllers: [CityRestaurantController]
})
export class CityRestaurantModule {}
