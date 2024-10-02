import { Module } from '@nestjs/common';
import { CultureRecipeService } from './culture-recipe.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecipeEntity } from '../recipe/recipe.entity/recipe.entity';
import { CultureEntity } from '../culture/culture.entity/culture.entity';
import { CultureRecipeController } from './culture-recipe.controller';
import { CultureRecipeResolver } from './culture-recipe.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([CultureEntity, RecipeEntity])],
  providers: [CultureRecipeService, CultureRecipeResolver],
  controllers: [CultureRecipeController]
})
export class CultureRecipeModule {}
