import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductCultureService } from './product-culture.service';
import { ProductEntity } from '../product/product.entity';
import { CultureEntity } from '../culture/culture.entity/culture.entity';
import { ProductCultureController } from './product-culture.controller';
import { ProductCultureResolver } from './product-culture.resolver';


@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity, CultureEntity])
],
  providers: [ProductCultureService, ProductCultureResolver],
  controllers: [ProductCultureController],
})
export class ProductCultureModule {}
