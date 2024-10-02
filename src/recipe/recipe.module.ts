import { Module } from '@nestjs/common';
import { RecipeService } from './recipe.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecipeEntity } from './recipe.entity/recipe.entity';
import { RecipeController } from './recipe.controller';
import { CacheModule } from '@nestjs/cache-manager';
import { RecipeResolver } from './recipe.resolver';
import * as sqliteStore from 'cache-manager-sqlite';

@Module({
  imports: [TypeOrmModule.forFeature([RecipeEntity]),
            CacheModule.register({
              store: sqliteStore,
              path: ':memory:',
              options: {
                ttl: 5,
              },
            }),
],
  providers: [RecipeService, RecipeResolver],
  controllers: [RecipeController]
})
export class RecipeModule {}
