import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ProductCategoryService } from './product-category.service';
import { plainToInstance } from 'class-transformer';
import { CategoryEntity } from '../category/category.entity';
import { ProductEntity } from '../product/product.entity';
import { ProductDto } from '../product/product.dto/product.dto';

@Resolver()
export class ProductCategoryResolver {
  constructor(private productCategoryService: ProductCategoryService) {}

  @Mutation(() => CategoryEntity)
  async addProductToCategory(
    @Args('categoryId') categoryId: string,
    @Args('productId') productId: string,
  ): Promise<CategoryEntity> {
      return await this.productCategoryService.addProductCategory(categoryId, productId);
  }

  @Query(() => ProductEntity)
  async findProductByCategoryIdAndProductId(
    @Args('categoryId') categoryId: string,
    @Args('productId') productId: string,
  ): Promise<ProductEntity> {
      return await this.productCategoryService.findCategoryByProductIdCategoryId(categoryId, productId);
  }

  @Query(() => [ProductEntity])
  async findProductsByCategoryId(
    @Args('categoryId') categoryId: string,
  ): Promise<ProductEntity[]> {
      return await this.productCategoryService.findCategoriesByProductId(categoryId);
  }

  @Mutation(() => [CategoryEntity])
  async associateProductsToCategory(
    @Args('categoryId') categoryId: string,
    @Args('products', { type: () => [ProductDto] }) productsDtos: ProductDto[],
  ): Promise<CategoryEntity> {
    const products = plainToInstance(ProductEntity, productsDtos);
    return await this.productCategoryService.associateCategoriesProduct(categoryId, products);
  }

  @Mutation(() => String)
  async deleteProductFromCategory(
    @Args('categoryId') categoryId: string,
    @Args('productId') productId: string,
  ): Promise<void> {
      await this.productCategoryService.deleteProductFromCategory(categoryId, productId);
  }
}
