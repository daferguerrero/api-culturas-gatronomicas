import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { ProductEntity } from './product.entity';
import { faker } from '@faker-js/faker';
import { ProductService } from './product.service';
import { CacheModule } from '@nestjs/cache-manager';


describe('ProductService', () => {
  let service: ProductService;
  let repository: Repository<ProductEntity>;
  let productsList: ProductEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig(),CacheModule.register()],
      providers: [ProductService],
    }).compile();

    service = module.get<ProductService>(ProductService);
    repository = module.get<Repository<ProductEntity>>(
      getRepositoryToken(ProductEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    await repository.clear();
    productsList = [];
    for(let i = 0; i < 5; i++){
      const product: ProductEntity = await repository.save({
        name: faker.commerce.productName(),
        description: faker.lorem.paragraph(),
        history: faker.lorem.paragraph(),
        category: null,
        culture: null
      });
      productsList.push(product);
  }
  };

  it('findAll should return all products', async () => {
     const products: ProductEntity[] = await service.findAll();
     expect(products).not.toBeNull();
     expect(products).toHaveLength(productsList.length);
   });

  it('findOne should return a product by id', async () => {
     const storedProduct: ProductEntity = productsList[0];
     const product: ProductEntity = await service.findOne(storedProduct.id);
     expect(product).not.toBeNull();
     expect(product.name).toEqual(storedProduct.name)
     expect(product.description).toEqual(storedProduct.description)
   });

  it('findOne should throw an exception for an invalid product', async () => {
     await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "No se encontró el producto con la identificación proporcionada")
   });

  it('create should return a new product', async () => {
     const product: ProductEntity = {
       id: "",
       name: faker.commerce.productName(),
       description: faker.lorem.paragraph(),
       history: faker.lorem.paragraph(),
       category: null,
       culture: null
     }

     const newProduct: ProductEntity = await service.create(product);
     expect(newProduct).not.toBeNull();

     const storedProduct: ProductEntity = await repository.findOne({where: {id: newProduct.id}})
     expect(storedProduct).not.toBeNull();
     expect(storedProduct.name).toEqual(newProduct.name)
     expect(storedProduct.description).toEqual(newProduct.description)
   });

  it('update should modify a product', async () => {
     const product: ProductEntity = productsList[0];
     product.name = "Nuevo nombre";
     product.description = "Nueva descripción";
      const updatedProduct: ProductEntity = await service.update(product.id, product);
     expect(updatedProduct).not.toBeNull();
      const storedProduct: ProductEntity = await repository.findOne({ where: { id: product.id } })
     expect(storedProduct).not.toBeNull();
     expect(storedProduct.name).toEqual(product.name)
     expect(storedProduct.description).toEqual(product.description)
   });

  it('update should throw an exception for an invalid product', async () => {
     let product: ProductEntity = productsList[0];
     product = {
       ...product, name: "Nuevo nombre", description: "Nueva descripción"
     }
     await expect(() => service.update("0", product)).rejects.toHaveProperty("message", "No se encontró el museo con la identificación proporcionada")
   });

  it('delete should remove a product', async () => {
     const product: ProductEntity = productsList[0];
     await service.delete(product.id);
      const deletedProduct: ProductEntity = await repository.findOne({ where: { id: product.id } })
     expect(deletedProduct).toBeNull();
   });

  it('delete should throw an exception for an invalid product', async () => {
     await expect(() => service.delete("0")).rejects.toHaveProperty("message", "No se encontró el museo con la identificación proporcionada")
   });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

});
