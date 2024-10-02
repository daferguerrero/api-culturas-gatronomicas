import { Module } from '@nestjs/common';
import { ProductCategoryService } from './product-category.service';
import { ProductCategoryController } from './product-category.controller';

import { ProductEntity } from '../product/product.entity';
import { CategoryEntity } from '../category/category.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductCategoryResolver } from './product-category.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductEntity, CategoryEntity]),
  ],
  providers: [ProductCategoryService, ProductCategoryResolver],
  controllers: [ProductCategoryController],
})
export class ProductCategoryModule {}
