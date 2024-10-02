import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CultureService } from './culture.service';
import { CultureEntity } from './culture.entity/culture.entity';
import { CultureController } from './culture.controller';
import { CacheModule } from '@nestjs/cache-manager';
import { CultureResolver } from './culture.resolver';
import * as sqliteStore from 'cache-manager-sqlite';

@Module({
  imports: [TypeOrmModule.forFeature([CultureEntity]),
  CacheModule.register({
    store: sqliteStore,
    path: ':memory:',
    options: {
      ttl: 5,
    },
  }),],
  providers: [CultureService, CultureResolver],
  controllers: [CultureController]
})
export class CultureModule {}
