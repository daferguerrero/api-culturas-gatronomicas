import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CountryEntity } from './country.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import {
  BusinessLogicException,
  BusinessError,
} from '../shared/errors/business-errors';

@Injectable()
export class CountryService {

  cacheKey: string = "countries";

  constructor(
    @InjectRepository(CountryEntity)
    private readonly countryRepository: Repository<CountryEntity>,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache
  ) {}

  async findAll(): Promise<CountryEntity[]> {
    const cached: CountryEntity[] = await this.cacheManager.get<CountryEntity[]>(this.cacheKey);

    if(!cached){
      const countries: CountryEntity[] = await this.countryRepository.find({ relations: ["cities"] });
      await this.cacheManager.set(this.cacheKey, countries);
      return countries;
    }

    return cached;
  }

  async findOne(id: string): Promise<CountryEntity> {
    const museum: CountryEntity = await this.countryRepository.findOne({
      where: { id },
      relations: ['cities'],
    });
    if (!museum)
      throw new BusinessLogicException(
        'The country with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return museum;
  }

  async create(museum: CountryEntity): Promise<CountryEntity> {
    return await this.countryRepository.save(museum);
  }

  async update(id: string, country: CountryEntity): Promise<CountryEntity> {
    const countryToUpdate: CountryEntity = await this.findOne(id);
    if (!countryToUpdate)
      throw new BusinessLogicException(
        'The country with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return await this.countryRepository.save({
      ...countryToUpdate,
      ...country,
    });
  }

  async remove(id: string): Promise<void> {
    const countryToRemove: CountryEntity = await this.findOne(id);
    if (!countryToRemove)
      throw new BusinessLogicException(
        'The country with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    await this.countryRepository.remove(countryToRemove);
  }
}
