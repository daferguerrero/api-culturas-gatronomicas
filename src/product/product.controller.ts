import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors, UseGuards } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ProductService } from './product.service';
import { ProductDto } from './product.dto/product.dto'
import { ProductEntity } from './product.entity';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from 'src/roles.guard';
import { Roles } from 'src/roles.decorator';


@Controller('product')
@UseInterceptors(BusinessErrorsInterceptor)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles('reader')
  async findAll() {
    return await this.productService.findAll();
  }

  @Get(':productId')
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles('reader','reader_single')
  async findOne(@Param('productId') productId: string) {
    return await this.productService.findOne(productId);
  }

  @Post()
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles('writer')
  async create(@Body() productDto: ProductDto) {
    const product: ProductEntity = plainToInstance(ProductEntity, productDto);
    return await this.productService.create(product);
  }

  @Put(':productId')
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles('writer')
  async update(@Param('productId') productId: string, @Body() productDto: ProductDto) {
    const product: ProductEntity = plainToInstance(ProductEntity, productDto);
    return await this.productService.update(productId, product);
  }

  @Delete(':productId')
  @HttpCode(204)
  async delete(@Param('productId') productId: string) {
    return await this.productService.delete(productId);
  }
}
