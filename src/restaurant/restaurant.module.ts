import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestaurantEntity } from './restaurant.entity/restaurant.entity';
import { RestaurantService } from './restaurant.service';
import { RestaurantController } from './restaurant.controller';
import { CityEntity } from '../city/city.entity';
import { CacheModule } from '@nestjs/cache-manager';
import { RestaurantResolver } from './restaurant.resolver';
import * as sqliteStore from 'cache-manager-sqlite';

@Module({
  imports: [TypeOrmModule.forFeature([RestaurantEntity, CityEntity]),
  CacheModule.register({
    store: sqliteStore,
    path: ':memory:',
    options: {
      ttl: 5,
    },
  }),
],
  providers: [RestaurantService, RestaurantResolver],
  controllers: [RestaurantController],
})
export class RestaurantModule {}
