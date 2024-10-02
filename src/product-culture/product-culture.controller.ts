
import { Controller, Post, Get, Put, Delete, Param, Body, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { ProductEntity } from '../product/product.entity';
import { CultureEntity } from '../culture/culture.entity/culture.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from '../roles.guard';
import { Roles } from '../roles.decorator';
import { ProductCultureService } from './product-culture.service';

@Controller('cultures')
export class ProductCultureController {
  constructor(private readonly service: ProductCultureService) {}

  @Post(':cultureId/products/:productId')
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles('writer')
  async addProductToCulture(
    @Param('cultureId') cultureId: string,
    @Param('productId') productId: string,
  ): Promise<CultureEntity> {
    try {
      return await this.service.addProductCulture(cultureId, productId);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Get(':cultureId/products/:productId')
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles('reader','reader_single')
  async findProductByCultureIdAndProductId(
    @Param('cultureId') cultureId: string,
    @Param('productId') productId: string,
  ): Promise<ProductEntity> {
    try {
      return await this.service.findProductByCultureIdAndProductId(cultureId, productId);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Get(':cultureId/products')
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles('reader')
  async findProductsByCultureId(
    @Param('cultureId') cultureId: string,
  ): Promise<ProductEntity[]> {
    try {
      return await this.service.findProductsByCultureId(cultureId);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Put(':cultureId/products')
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles('writer')
  async associateProductsToCulture(
    @Param('cultureId') cultureId: string,
    @Body() products: ProductEntity[],
  ): Promise<CultureEntity> {
    try {
      return await this.service.associateProductToCulture(cultureId, products);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Delete(':cultureId/products/:productId')
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles('deleter')
  async deleteProductFromCulture(
    @Param('cultureId') cultureId: string,
    @Param('productId') productId: string,
  ): Promise<void> {
    try {
      await this.service.deleteCultureProduct(cultureId, productId);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }
}
