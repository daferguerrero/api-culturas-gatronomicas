import { Controller, Post, Get, Put, Delete, Param, Body, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { ProductEntity } from '../product/product.entity';
import { CategoryEntity } from '../category/category.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from '../roles.guard';
import { Roles } from '../roles.decorator';
import { ProductCategoryService } from './product-category.service';

@Controller('categories')
export class ProductCategoryController {
  constructor(private readonly service: ProductCategoryService) {}

  @Post(':categoryId/products/:productId')
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles('writer')
  async addProductToCategory(
    @Param('categoryId') categoryId: string,
    @Param('productId') productId: string,
  ): Promise<CategoryEntity> {
    try {
      return await this.service.addProductCategory(categoryId, productId);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Get(':categoryId/products/:productId')
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles('reader','reader_single')
  async findProductByCategoryIdAndProductId(
    @Param('categoryId') categoryId: string,
    @Param('productId') productId: string,
  ): Promise<ProductEntity> {
    try {
      return await this.service.findCategoryByProductIdCategoryId(categoryId, productId);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Get(':categoryId/products')
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles('reader')
  async findProductsByCategoryId(
    @Param('categoryId') categoryId: string,
  ): Promise<ProductEntity[]> {
    try {
      return await this.service.findCategoriesByProductId(categoryId);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Put(':categoryId/products')
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles('writer')
  async associateProductsToCategory(
    @Param('categoryId') categoryId: string,
    @Body() products: ProductEntity[],
  ): Promise<CategoryEntity> {
    try {
      return await this.service.associateCategoriesProduct(categoryId, products);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Delete(':categoryId/products/:productId')
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles('deleter')
  async deleteProductFromCategory(
    @Param('categoryId') categoryId: string,
    @Param('productId') productId: string,
  ): Promise<void> {
    try {
      await this.service.deleteProductFromCategory(categoryId, productId);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }
}
