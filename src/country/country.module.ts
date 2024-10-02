import { Module } from '@nestjs/common';
import { CountryService } from './country.service';
import { CountryEntity } from './country.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CountryController } from './country.controller';
import { CacheModule } from '@nestjs/cache-manager';
import { CountryResolver } from './country.resolver';
import * as sqliteStore from 'cache-manager-sqlite';

@Module({
  imports: [
    TypeOrmModule.forFeature([CountryEntity]),
    CacheModule.register({
      store: sqliteStore,
      path: ':memory:',
      options: {
        ttl: 2,
      },
    }),
  ],
  providers: [CountryService, CountryResolver],
  controllers: [CountryController],
})
export class CountryModule {}
