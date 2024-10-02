import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CountryModule } from './country/country.module';
import { CityModule } from './city/city.module';
import { CountryCityModule } from './city-country/country-city.module';
import { ProductModule } from './product/product.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CountryEntity } from './country/country.entity';
import { CityEntity } from './city/city.entity';
import { RestaurantModule } from './restaurant/restaurant.module';
import { CultureModule } from './culture/culture.module';
import { RestaurantEntity } from './restaurant/restaurant.entity/restaurant.entity';
import { RecipeEntity } from './recipe/recipe.entity/recipe.entity';
import { RecipeModule } from './recipe/recipe.module';
import { CultureRecipeModule } from './culture-recipe/culture-recipe.module';
import { CityRestaurantModule } from './city-restaurant/city-restaurant.module';
import { ProductCategoryModule } from './product-category/product-category.module';
import { ProductCultureModule } from './product-culture/product-culture.module';
import { CategoryEntity } from './category/category.entity';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { UserController } from './user/user.controller';
import { CultureEntity } from './culture/culture.entity/culture.entity';
import { ProductEntity } from './product/product.entity';
import { CategoryModule } from './category/category.module';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { ApolloDriver } from '@nestjs/apollo';
import { CultureRestaurantModule } from './culture-restaurant/culture-restaurant.module';

@Module({
  imports: [
    CountryModule,
    CityModule,
    CountryCityModule,
    RestaurantModule,
    CultureModule,
    ProductModule,
    ProductCultureModule,
    ProductCategoryModule,
    CultureRestaurantModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'cultura',
      entities: [
        CountryEntity,
        CityEntity,
        RestaurantEntity,
        CultureEntity,
        RecipeEntity,
        ProductEntity,
        CategoryEntity,
      ],
      dropSchema: false,
      synchronize: true,
      keepConnectionAlive: true,
    }),
    RecipeModule,
    CultureRecipeModule,
    CityRestaurantModule,
    UserModule,
    CategoryModule,
    AuthModule,
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      driver: ApolloDriver,
    }),
  ],
  controllers: [AppController, UserController],
  providers: [AppService],
})
export class AppModule {}
