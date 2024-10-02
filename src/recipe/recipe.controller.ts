import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { RecipeService } from './recipe.service';
import { RecipeDto } from './recipe.dto';
import { plainToInstance } from 'class-transformer';
import { RecipeEntity } from './recipe.entity/recipe.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { Roles } from 'src/roles.decorator';
import { RolesGuard } from 'src/roles.guard';

@Controller('recipes')
@UseInterceptors(BusinessErrorsInterceptor)
export class RecipeController {
    

    constructor(private readonly recipeService: RecipeService) {}

    @Get()
    @UseGuards(JwtAuthGuard,RolesGuard)
    @Roles('reader')
    async findAll() {
        return await this.recipeService.findAll();
    }    

    @Get(':recipeId')
    @UseGuards(JwtAuthGuard,RolesGuard)
    @Roles('reader_single','reader')
    async findOne(@Param('recipeId') recipeId: string) {
        return await this.recipeService.findOne(recipeId);
    }

    @Post()
    @UseGuards(JwtAuthGuard,RolesGuard)
    @Roles('writer')
    async create(@Body() recipeDto: RecipeDto) {
        const recipe: RecipeEntity = plainToInstance(RecipeEntity, recipeDto);
        return await this.recipeService.create(recipe);
    }

    @Put(':recipeId')
    @UseGuards(JwtAuthGuard,RolesGuard)
    @Roles('writer')
    async update(@Param('recipeId') recipeId: string, @Body() recipeDto: RecipeDto) {
        const recipe: RecipeEntity = plainToInstance(RecipeEntity, recipeDto);
        return await this.recipeService.update(recipeId, recipe);
    }

    @Delete(':recipeId')
    @HttpCode(204)
    @UseGuards(JwtAuthGuard,RolesGuard)
    @Roles('deleter')
    async delete(@Param('recipeId') recipeId: string) {
        return await this.recipeService.delete(recipeId);
    }
}
