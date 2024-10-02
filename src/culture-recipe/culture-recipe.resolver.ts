import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CultureRecipeService } from './culture-recipe.service';
import { CultureEntity } from 'src/culture/culture.entity/culture.entity';
import { RecipeEntity } from 'src/recipe/recipe.entity/recipe.entity';
import { RecipeDto } from 'src/recipe/recipe.dto';
import { plainToInstance } from 'class-transformer';

@Resolver()
export class CultureRecipeResolver {

    constructor(private cultureRecipeService: CultureRecipeService) {}

    
    @Mutation(() => CultureEntity)
    async addRecipeToCulture(
      @Args('cultureId') cultureId: string,
      @Args('recipeId') recipeId: string,
    ): Promise<CultureEntity> {
      return await this.cultureRecipeService.addRecipeToCulture(cultureId, recipeId);
    }

    
    @Query(() => RecipeEntity)
    async findRecipeByCultureIdAndRecipeId(
        @Args('cultureId') cultureId: string,
        @Args('recipeId') recipeId: string,
    ): Promise<RecipeEntity> {
      return await this.cultureRecipeService.findRecipeByCultureIdAndRecipeId(cultureId,recipeId);
    }

    @Query(() => [RecipeEntity])
    async findRecipesByCultureId(
        @Args('cultureId') cultureId: string
    ): Promise<RecipeEntity[]> {
      return await this.cultureRecipeService.findRecipesByCultureId(cultureId);
    }

    @Mutation(() => CultureEntity)
    async associateRecipesToCulture(
      @Args('recipes', { type: () => [RecipeDto] }) recipesDto: RecipeDto[],
      @Args('cultureId') cultureId: string,
    ): Promise<CultureEntity> {
      const recipes = plainToInstance(RecipeEntity, recipesDto);
      return await this.cultureRecipeService.associateRecipesToCulture(
        cultureId,
        recipes,
      );
    }

    @Mutation(() => String)
    async deleteRecipeFromCulture(
        @Args('cultureId') cultureId: string,
        @Args('recipeId') recipeId: string,
    ) {
      return await this.cultureRecipeService.deleteRecipeFromCulture(cultureId, recipeId);
    }
  

}
