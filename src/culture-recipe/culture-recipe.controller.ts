import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { CultureRecipeService } from './culture-recipe.service'; 
import { plainToInstance } from 'class-transformer';
import { RecipeDto } from 'src/recipe/recipe.dto';
import { RecipeEntity } from 'src/recipe/recipe.entity/recipe.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from 'src/roles.guard';
import { Roles } from 'src/roles.decorator';

@Controller('cultures/:cultureId/recipes')
@UseInterceptors(BusinessErrorsInterceptor)
export class CultureRecipeController {

    constructor(private readonly cultureRecipeService: CultureRecipeService) {}
    
    @Post(':recipeId')
    @UseGuards(JwtAuthGuard,RolesGuard)
    @Roles('writer')
    async addRecipeToCulture(
        @Param('cultureId') cultureId: string,
        @Param('recipeId') recipeId: string
    ) {
        return await this.cultureRecipeService.addRecipeToCulture(cultureId, recipeId);
    }
    
    @Get(':recipeId')
    @UseGuards(JwtAuthGuard,RolesGuard)
    @Roles('reader_single','reader')
    async findRecipeByCultureId(
        @Param('cultureId') cultureId: string,
        @Param('recipeId') recipeId: string
    ) {
        return await this.cultureRecipeService.findRecipeByCultureIdAndRecipeId(cultureId, recipeId);
    }
    
    @Get()
    @UseGuards(JwtAuthGuard,RolesGuard)
    @Roles('reader')
    async findRecipesByCultureId(@Param('cultureId') cultureId: string) {
        return await this.cultureRecipeService.findRecipesByCultureId(cultureId);
    }
    
    @Put()
    @UseGuards(JwtAuthGuard,RolesGuard)
    @Roles('writer')
    async associateRecipesToCulture(
        @Body() recipesDto: RecipeDto[], 
        @Param('cultureId') cultureId: string
    ) {
        const recipes = plainToInstance(RecipeEntity, recipesDto);
        return await this.cultureRecipeService.associateRecipesToCulture(cultureId, recipes);
    }
    
    @Delete(':recipeId')
    @HttpCode(204)
    @UseGuards(JwtAuthGuard,RolesGuard)
    @Roles('deleter')
    async removeRecipeFromCulture(
        @Param('cultureId') cultureId: string,
        @Param('recipeId') recipeId: string
    ) {
        return await this.cultureRecipeService.deleteRecipeFromCulture(cultureId, recipeId);
    }
}
