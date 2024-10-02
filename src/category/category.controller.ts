import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors, UseGuards } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { CategoryEntity } from './category.entity';
import { CategoryDto } from './category.dto';
import { plainToInstance } from 'class-transformer';
import { CategoryService } from './category.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from 'src/roles.guard';
import { Roles } from 'src/roles.decorator';


@Controller('categories')
@UseInterceptors(BusinessErrorsInterceptor)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles('reader')
  async findAll() {
    return await this.categoryService.findAll();
  }

  @Get(':categoryId')
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles('reader','reader_single')
  async findOne(@Param('categoryId') categoryId: string) {
    return await this.categoryService.findOne(categoryId);
  }

  @Post()
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles('writer')
  async create(@Body() categoryDto: CategoryDto) {
    const category: CategoryEntity = plainToInstance(CategoryEntity, categoryDto);
    return await this.categoryService.create(category);
  }

  @Put(':categoryId')
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles('writer')
  async update(@Param('categoryId') categoryId: string, @Body() categoryDto: CategoryDto) {
    const category: CategoryEntity = plainToInstance(CategoryEntity, categoryDto);
    return await this.categoryService.update(categoryId, category);
  }

  @Delete(':categoryId')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles('deleter')
  async delete(@Param('categoryId') categoryId: string) {
    return await this.categoryService.delete(categoryId);
  }
}
