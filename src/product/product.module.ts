import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ProductEntity } from './product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { ProductResolver } from './product.resolver';
import * as sqliteStore from 'cache-manager-sqlite';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity]),
            CacheModule.register({
              store: sqliteStore,
              path: ':memory:',
              options: {
                ttl: 5
              },
            })
          ],
  providers: [ProductService, ProductResolver],
  controllers: [ProductController]
})
export class ProductModule {}
