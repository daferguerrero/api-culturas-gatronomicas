import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { CityEntity } from './city.entity';
import { CityService } from './city.service';
import { CityDto } from './city.dto';
import { plainToInstance } from 'class-transformer';

@Resolver()
export class CityResolver {

  constructor(private cityService: CityService) {}

  @Query(() => [CityEntity])
  cities(): Promise<CityEntity[]> {
    return this.cityService.findAll();
  }

  @Query(() => CityEntity)
  city(@Args('id') id: string): Promise<CityEntity> {
    return this.cityService.findOne(id);
  }

  @Mutation(() => CityEntity)
  createCity(@Args('city') cityDto: CityDto): Promise<CityEntity> {
    const city = plainToInstance(CityEntity, cityDto);
    return this.cityService.create(city);
  }

  @Mutation(() => CityEntity)
  updateCity(@Args('id') id: string, @Args('city') cityDto: CityDto): Promise<CityEntity> {
    const city = plainToInstance(CityEntity, cityDto);
    return this.cityService.update(id, city);
  }

  @Mutation(() => String)
  deleteCity(@Args('id') id: string) {
    this.cityService.remove(id);
    return id;
  }
}
