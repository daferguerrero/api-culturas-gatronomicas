import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ProductCultureService } from './product-culture.service';
import { CultureEntity } from '../culture/culture.entity/culture.entity';
import { ProductEntity } from '../product/product.entity';
import { ProductDto } from '../product/product.dto/product.dto';
import { plainToInstance } from 'class-transformer';

@Resolver()
export class ProductCultureResolver {

  constructor(private productCultureService: ProductCultureService) {}

  @Mutation(() => CultureEntity)
  async addProductToCulture(
    @Args('cultureId') cultureId: string,
    @Args('productId') productId: string,
  ): Promise<CultureEntity> {
      return await this.productCultureService.addProductCulture(cultureId, productId);
  }

  @Query(() => ProductEntity)
  async findProductByCultureIdAndProductId(
    @Args('cultureId') cultureId: string,
    @Args('productId') productId: string,
  ): Promise<ProductEntity> {
      return await this.productCultureService.findProductByCultureIdAndProductId(cultureId, productId);
  }

  @Query(() => [ProductEntity])
  async findProductsByCultureId(
    @Args('cultureId') cultureId: string,
  ): Promise<ProductEntity[]> {
      return await this.productCultureService.findProductsByCultureId(cultureId);
  }

  @Mutation(() => [CultureEntity])
  async associateProductsToCulture(
    @Args('cultureId') cultureId: string,
    @Args('products', { type: () => [ProductDto] }) productsDtos: ProductDto[],
  ): Promise<CultureEntity> {
    const products = plainToInstance(ProductEntity, productsDtos);
    return await this.productCultureService.associateProductToCulture(cultureId, products);
  }

  @Mutation(() => String)
  async deleteProductFromCulture(
    @Args('cultureId') cultureId: string,
    @Args('productId') productId: string,
  ): Promise<void> {
      await this.productCultureService.deleteCultureProduct(cultureId, productId);
  }

}
