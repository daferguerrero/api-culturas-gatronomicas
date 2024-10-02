import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RecipeEntity } from './recipe.entity/recipe.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import {
  BusinessLogicException,
  BusinessError,
} from '../shared/errors/business-errors';

@Injectable()
export class RecipeService {

  cacheKey: string = "recipes";

  constructor(
    @InjectRepository(RecipeEntity)
    private readonly recipeRepository: Repository<RecipeEntity>,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache
  ) {}

  async findAll(): Promise<RecipeEntity[]> {
    const cached: RecipeEntity[] = await this.cacheManager.get<RecipeEntity[]>(this.cacheKey);
    
    if(!cached){
      const recipes: RecipeEntity[] = await this.recipeRepository.find({ relations: ['culture'] });
      await this.cacheManager.set(this.cacheKey, recipes);
      return recipes;
    }
    return cached;

  }

  async findOne(id: string): Promise<RecipeEntity> {
    const recipe: RecipeEntity = await this.recipeRepository.findOne({
      where: { id },
      relations: ['culture'],
    });
    if (!recipe) {
      throw new BusinessLogicException(
        'The recipe with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }
    return recipe;
  }

  async create(recipe: RecipeEntity): Promise<RecipeEntity> {
    return await this.recipeRepository.save(recipe);
  }

  async update(id: string, recipe: RecipeEntity): Promise<RecipeEntity> {
    const recipeToUpdate: RecipeEntity = await this.findOne(id);
    if (!recipeToUpdate) {
      throw new BusinessLogicException(
        'The recipe with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }
    return await this.recipeRepository.save({ ...recipeToUpdate, ...recipe });
  }

  async delete(id: string): Promise<void> {
    const recipeToRemove: RecipeEntity = await this.findOne(id);
    if (!recipeToRemove) {
      throw new BusinessLogicException(
        'The recipe with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }
    await this.recipeRepository.remove(recipeToRemove);
  }
}
