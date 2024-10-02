import { Module } from '@nestjs/common';
import { CultureRestaurantService } from './culture-restaurant.service';
import { CultureRestaurantController } from './culture-restaurant.controller';
import { CultureRestaurantResolver } from './culture-restaurant.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CultureEntity } from '../culture/culture.entity/culture.entity';
import { RestaurantEntity } from '../restaurant/restaurant.entity/restaurant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CultureEntity, RestaurantEntity])],
  providers: [CultureRestaurantService, CultureRestaurantResolver],
  controllers: [CultureRestaurantController]
})
export class CultureRestaurantModule {}
