import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { CultureEntity } from '../culture/culture.entity/culture.entity';
import { RecipeEntity } from '../recipe/recipe.entity/recipe.entity';

@Injectable()
export class CultureRecipeService {
  constructor(
    @InjectRepository(CultureEntity)
    private readonly cultureRepository: Repository<CultureEntity>,

    @InjectRepository(RecipeEntity)
    private readonly recipeRepository: Repository<RecipeEntity>
  ) {}

  async addRecipeToCulture(cultureId: string, recipeId: string): Promise<CultureEntity> {
    
    const recipe: RecipeEntity = await this.recipeRepository.findOne({ where: { id: recipeId } });
    if (!recipe) {
      throw new BusinessLogicException('The recipe with the given id was not found', BusinessError.NOT_FOUND);
    }

    const culture: CultureEntity = await this.cultureRepository.findOne({ where: { id: cultureId }, relations: ['recipes'] });
    if (!culture) {
      throw new BusinessLogicException('The culture with the given id was not found', BusinessError.NOT_FOUND);
    }

    if (culture.recipes.some(existingRecipe => existingRecipe.id === recipe.id)) {
      throw new BusinessLogicException('The recipe already exists in culture', BusinessError.PRECONDITION_FAILED);
    }

    culture.recipes = [...culture.recipes, recipe];
    return await this.cultureRepository.save(culture);
  }

  async findRecipeByCultureIdAndRecipeId(cultureId: string, recipeId: string): Promise<RecipeEntity> {
    const culture: CultureEntity = await this.cultureRepository.findOne({ where: { id: cultureId }, relations: ['recipes'] });
    if (!culture) {
      throw new BusinessLogicException('The culture with the given id was not found', BusinessError.NOT_FOUND);
    }

    const recipe: RecipeEntity = culture.recipes.find(recipe => recipe.id === recipeId);
    if (!recipe) {
      throw new BusinessLogicException('The recipe with the given id is not associated with the culture', BusinessError.PRECONDITION_FAILED);
    }

    return recipe;
  }

  async findRecipesByCultureId(cultureId: string): Promise<RecipeEntity[]> {
    const culture: CultureEntity = await this.cultureRepository.findOne({ where: { id: cultureId }, relations: ['recipes'] });
    if (!culture) {
      throw new BusinessLogicException('The culture with the given id was not found', BusinessError.NOT_FOUND);
    }

    return culture.recipes;
  }

  async associateRecipesToCulture(cultureId: string, recipes: RecipeEntity[]): Promise<CultureEntity> {

    const culture: CultureEntity = await this.cultureRepository.findOne({ where: { id: cultureId }, relations: ['recipes'] });
    if (!culture) {
      throw new BusinessLogicException('The culture with the given id was not found', BusinessError.NOT_FOUND);
    }

    const recipeList: RecipeEntity[] = []; // Nueva lista de recetas
    for (let i = 0; i < recipes.length; i++) {
      const recipe: RecipeEntity = await this.recipeRepository.findOne({where: {id: recipes[i].id}});      
      if (!recipe)
        throw new BusinessLogicException("The recipe with the given id was not found", BusinessError.NOT_FOUND)
      recipeList.push(recipe);
    }

    culture.recipes = recipeList;
    return await this.cultureRepository.save(culture);

  }

  async deleteRecipeFromCulture(cultureId: string, recipeId: string): Promise<void> {
    const culture: CultureEntity = await this.cultureRepository.findOne({ where: { id: cultureId }, relations: ['recipes'] });
    if (!culture) {
      throw new BusinessLogicException('The culture with the given id was not found', BusinessError.NOT_FOUND);
    }

    const recipeIndex = culture.recipes.findIndex(recipe => recipe.id === recipeId);
    if (recipeIndex === -1) {
      throw new BusinessLogicException('The recipe with the given id is not associated with the culture', BusinessError.PRECONDITION_FAILED);
    }

    const recipe: RecipeEntity = culture.recipes[recipeIndex];
    recipe.culture = null; // Desasociamos la cultura de la receta
    await this.recipeRepository.save(recipe);

    culture.recipes.splice(recipeIndex, 1); // Removemos la receta de la lista de la cultura
    await this.cultureRepository.save(culture);
  }
}

