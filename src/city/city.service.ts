import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CityEntity } from './city.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import {
  BusinessLogicException,
  BusinessError,
} from '../shared/errors/business-errors';


@Injectable()
export class CityService {

  cacheKey: string = "cities";

  constructor(
    @InjectRepository(CityEntity)
    private readonly cityRepository: Repository<CityEntity>,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache
  ) {}

  async findAll(): Promise<CityEntity[]> {
    const cached: CityEntity[] = await this.cacheManager.get<CityEntity[]>(this.cacheKey);

    if(!cached){
      const cities: CityEntity[] = await this.cityRepository.find({ relations: ["country"] });
      await this.cacheManager.set(this.cacheKey, cities);
      return cities;
    }

    return cached;
  }

  async findOne(id: string): Promise<CityEntity> {
    const city: CityEntity = await this.cityRepository.findOne({
      where: { id },
      relations: ['country'],
    });
    if (!city)
      throw new BusinessLogicException(
        'The city with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return city;
  }

  async create(city: CityEntity): Promise<CityEntity> {
    return await this.cityRepository.save(city);
  }

  async update(id: string, city: CityEntity): Promise<CityEntity> {
    const cityToUpdate: CityEntity = await this.findOne(id);
    if (!cityToUpdate)
      throw new BusinessLogicException(
        'The city with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return await this.cityRepository.save({ ...cityToUpdate, ...city });
  }

  async remove(id: string): Promise<void> {
    const cityToRemove: CityEntity = await this.findOne(id);
    if (!cityToRemove)
      throw new BusinessLogicException(
        'The city with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    await this.cityRepository.remove(cityToRemove);
  }
}
