import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CategoryEntity } from './category.entity';
import { CategoryService } from './category.service';
import { CategoryDto } from './category.dto';

@Resolver()
export class CategoryResolver {
    constructor(private readonly categoryService: CategoryService) {}
  
    @Query(() => [CategoryEntity])
    async getAllCategories(): Promise<CategoryEntity[]> {
      return await this.categoryService.findAll();
    }
  
    @Query(() => CategoryEntity)
    async getCategoryById(@Args('id') id: string): Promise<CategoryEntity> {
      return await this.categoryService.findOne(id);
    }
  
    @Mutation(() => CategoryEntity)
    async createCategory(@Args('categoryDto') categoryDto: CategoryDto): Promise<CategoryEntity> {
      return await this.categoryService.create(categoryDto);
    }
  
    @Mutation(() => CategoryEntity)
    async updateCategory(
      @Args('id') id: string,
      @Args('categoryDto') categoryDto: CategoryDto,
    ): Promise<CategoryEntity> {
      return await this.categoryService.update(id, categoryDto);
    }
  
    @Mutation(() => String)
    async deleteCategory(@Args('id') id: string): Promise<string> {
      await this.categoryService.delete(id);
      return `Category with ID ${id} has been deleted`;
    }
  }
