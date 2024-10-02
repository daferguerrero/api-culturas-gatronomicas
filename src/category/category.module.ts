import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { CategoryEntity } from './category.entity';
import { CacheModule } from '@nestjs/cache-manager';
import { CategoryResolver } from './category.resolver';
import * as sqliteStore from 'cache-manager-sqlite';


@Module({
imports: [TypeOrmModule.forFeature([CategoryEntity]),
  CacheModule.register({
    store: sqliteStore,
    path: ':memory:',
    options: {
      ttl: 5,
    },
  }),
],
  providers: [CategoryService, CategoryResolver],
  controllers: [CategoryController]
})
export class CategoryModule {}
