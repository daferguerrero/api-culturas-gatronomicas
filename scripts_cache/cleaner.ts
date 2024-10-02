
import { DataSource } from 'typeorm';
import { CultureEntity } from '../src/culture/culture.entity/culture.entity';
import { ProductEntity } from '../src/product/product.entity';
import { CityEntity } from '../src/city/city.entity';
import { CategoryEntity } from '../src/category/category.entity';
import { CountryEntity } from '../src/country/country.entity';
import { RecipeEntity } from '../src/recipe/recipe.entity/recipe.entity';
import { RestaurantEntity } from '../src/restaurant/restaurant.entity/restaurant.entity';

async function cleanDatabase() {
  // Configuración de la conexión utilizando variables de entorno
  const dataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    database: 'cultura',
    entities: [
      CultureEntity,
      ProductEntity,
      CityEntity,
      CategoryEntity,
      CountryEntity,
      RecipeEntity,
      RestaurantEntity,
    ],
    synchronize: false,
    logging: false,
  });

  try {
    await dataSource.initialize();
    console.log('Conexión a la base de datos establecida.');

    const entities = dataSource.entityMetadatas;

    // Truncar las tablas en orden inverso para respetar las dependencias
    for (let i = entities.length - 1; i >= 0; i--) {
      const entity = entities[i];
      const tableName = entity.tableName;

      try {
        await dataSource.query(`TRUNCATE TABLE "${tableName}" RESTART IDENTITY CASCADE;`);
        console.log(`Registros de la tabla "${tableName}" borrados exitosamente.`);
      } catch (truncateError) {
        console.error(`Error al truncar la tabla "${tableName}":`, truncateError);
      }
    }

    console.log('Base de datos limpiada exitosamente.');
  } catch (error) {
    console.error('Error al limpiar la base de datos:', error);
  } finally {
    // Cerrar la conexión
    await dataSource.destroy();
    console.log('Conexión a la base de datos cerrada.');
  }
}

cleanDatabase();
