import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CultureEntity } from './culture.entity/culture.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import {
    BusinessLogicException,
    BusinessError,
  } from '../shared/errors/business-errors';

@Injectable()
export class CultureService {

    cacheKey: string = "cultures";

    constructor(
        @InjectRepository(CultureEntity)
        private readonly cultureRepository: Repository<CultureEntity>,

        @Inject(CACHE_MANAGER)
        private readonly cacheManager: Cache
    ){}

    async findAll(): Promise<CultureEntity[]> {
      
      const cached: CultureEntity[] = await this.cacheManager.get<CultureEntity[]>(this.cacheKey);

      if(!cached){
        const cultures: CultureEntity[] = await this.cultureRepository.find({ relations: ['restaurants', 'products'] });
        await this.cacheManager.set(this.cacheKey, cultures);
        return cultures;
      }
      
      return cached;

    }

    async findOne(id: string): Promise<CultureEntity> {
        const culture: CultureEntity = await this.cultureRepository.findOne({where: {id}, relations: ["restaurants", "recipes","products"] } );
        if (!culture)
          throw new BusinessLogicException("The culture with the given id was not found", BusinessError.NOT_FOUND);
   
        return culture;
    }

    async create(culture: CultureEntity): Promise<CultureEntity> {
        return await this.cultureRepository.save(culture);
    }

    async update(id: string, culture: CultureEntity): Promise<CultureEntity> {
        const persistedCulture: CultureEntity = await this.cultureRepository.findOne({where:{id}});
        if (!persistedCulture)
          throw new BusinessLogicException("The culture with the given id was not found", BusinessError.NOT_FOUND);
        
        return await this.cultureRepository.save({...persistedCulture, ...culture});
    }

    async delete(id: string) {
        const culture: CultureEntity = await this.cultureRepository.findOne({where:{id}});
        if (!culture)
          throw new BusinessLogicException("The culture with the given id was not found", BusinessError.NOT_FOUND);
     
        await this.cultureRepository.remove(culture);
    }
}