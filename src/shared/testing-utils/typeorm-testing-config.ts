import { TypeOrmModule } from '@nestjs/typeorm';
import { CountryEntity } from '../../country/country.entity';
import { CityEntity } from '../../city/city.entity';
import { RestaurantEntity } from '../../restaurant/restaurant.entity/restaurant.entity';
import { CultureEntity } from '../../culture/culture.entity/culture.entity';
import { RecipeEntity } from '../../recipe/recipe.entity/recipe.entity';
import { CategoryEntity } from '../../category/category.entity';
import { ProductEntity } from '../../product/product.entity';

export const TypeOrmTestingConfig = () => [
  TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    entities: [
      CountryEntity,
      CityEntity,
      CultureEntity,
      RestaurantEntity,
      RecipeEntity,
      ProductEntity,
      CategoryEntity,
    ],
    synchronize: true,
    keepConnectionAlive: true,
  }),
  TypeOrmModule.forFeature([
    CountryEntity,
    CityEntity,
    CultureEntity,
    RestaurantEntity,
    RecipeEntity,
    ProductEntity,
    CategoryEntity,
  ]),
];
