import { DataSource } from 'typeorm';
import * as fs from 'fs/promises';
import * as path from 'path';
import { CultureEntity } from '../src/culture/culture.entity/culture.entity';
import { ProductEntity } from '../src/product/product.entity';
import { CityEntity } from '../src/city/city.entity';
import { CategoryEntity } from '../src/category/category.entity';
import { CountryEntity } from '../src/country/country.entity';
import { RecipeEntity } from '../src/recipe/recipe.entity/recipe.entity';
import { RestaurantEntity } from '../src/restaurant/restaurant.entity/restaurant.entity';

// Función para obtener todos los archivos SQL que comienzan con 'insert_'
async function getInsertSqlFiles(directory: string): Promise<string[]> {
  try {
    const files = await fs.readdir(directory);
    return files.filter(file => file.startsWith('inserts_') && file.endsWith('.sql'));
  } catch (error) {
    console.error(`Error al leer el directorio "${directory}":`, error);
    throw error;
  }
}

async function seedDatabase() {
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

    const sqlDirectory = path.join(__dirname, 'sql');
    const sqlFileNames = await getInsertSqlFiles(sqlDirectory);

    if (sqlFileNames.length === 0) {
      console.warn(`No se encontraron archivos SQL que comiencen con 'insert_' en el directorio "${sqlDirectory}".`);
    } else {
      for (const fileName of sqlFileNames) {
        try {
          const sqlFilePath = path.join(sqlDirectory, fileName);
          const sqlContent = await fs.readFile(sqlFilePath, 'utf-8');
          await dataSource.query(sqlContent);
          console.log(`Archivo "${fileName}" cargado exitosamente.`);
        } catch (fileError) {
          console.error(`Error al cargar el archivo "${fileName}":`, fileError);
        }
      }
    }

    console.log('Base de datos poblada exitosamente.');
  } catch (error) {
    console.error('Error al poblar la base de datos:', error);
  } finally {
    try {
      await dataSource.destroy();
      console.log('Conexión a la base de datos cerrada.');
    } catch (closeError) {
      console.error('Error al cerrar la conexión de la base de datos:', closeError);
    }
  }
}

seedDatabase();
