import { Test, TestingModule } from '@nestjs/testing';
import { ProductCultureService } from './product-culture.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { ProductEntity } from '../product/product.entity';
import { CultureEntity } from '../culture/culture.entity/culture.entity';
import { faker } from '@faker-js/faker';

describe('ProductCultureService', () => {
  let service: ProductCultureService;
  let cultureRepository: Repository<CultureEntity>;
  let productRepository: Repository<ProductEntity>;
  let culture: CultureEntity;
  let productsList: ProductEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ProductCultureService],
    }).compile();

    service = module.get<ProductCultureService>(ProductCultureService);
    cultureRepository = module.get<Repository<CultureEntity>>(
      getRepositoryToken(CultureEntity),
    );
    productRepository = module.get<Repository<ProductEntity>>(
      getRepositoryToken(ProductEntity),
    );

    await seedDatabase();
  });

  const seedDatabase = async () => {
    await productRepository.clear();
    await cultureRepository.clear();

    productsList = [];
    for (let i = 0; i < 5; i++) {
      const product: ProductEntity = await productRepository.save({
        name: faker.company.name(),
        description: faker.lorem.paragraph(),
        history: faker.lorem.paragraph(),
        category: null,
        culture: null,
      });
      productsList.push(product);
    }

    culture = await cultureRepository.save({
      name: faker.company.name(),
      description: faker.lorem.sentence(),
      products: productsList,
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addProductToCulture should add a product to a culture', async () => {
    const newProduct: ProductEntity = await productRepository.save({
      name: faker.company.name(),
      description: faker.lorem.paragraph(),
      history: faker.lorem.paragraph(),
      category: null,
      culture: null,
    });

    const newCulture: CultureEntity = await cultureRepository.save({
      name: faker.company.name(),
      description: faker.lorem.sentence(),
    });

    const result: CultureEntity = await service.addProductCulture(
      newCulture.id,
      newProduct.id,
    );

    expect(result.products.length).toBe(1);
    expect(result.products[0]).not.toBeNull();
    expect(result.products[0].name).toBe(newProduct.name);
  });

  it('addProductToCulture should throw an exception for an invalid restaurant', async () => {
    const newCulture: CultureEntity = await cultureRepository.save({
      name: faker.company.name(),
      description: faker.lorem.sentence(),
    });

    await expect(() =>
      service.addProductCulture(newCulture.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The product with the given id was not found',
    );
  });

  it('addProductToCulture should throw an exception for an invalid culture', async () => {
    const newProduct: ProductEntity = await productRepository.save({
      name: faker.company.name(),
      description: faker.lorem.paragraph(),
      history: faker.lorem.paragraph(),
      category: null,
      culture: null,
    });

    await expect(() =>
      service.addProductCulture('0', newProduct.id),
    ).rejects.toHaveProperty(
      'message',
      'The culture with the given id was not found',
    );
  });

  it('findProductByCultureIdAndProductId should return restaurant by culture', async () => {
    const product: ProductEntity = productsList[0];
    const storedProduct: ProductEntity =
      await service.findProductByCultureIdAndProductId(culture.id, product.id);
    expect(storedProduct).not.toBeNull();
    expect(storedProduct.name).toBe(product.name);
  });

  it('findProductByCultureIdAndProductId should throw an exception for an invalid restaurant', async () => {
    await expect(() =>
      service.findProductByCultureIdAndProductId(culture.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The product with the given id was not found',
    );
  });

  it('findProductByCultureIdAndProductId should throw an exception for an invalid culture', async () => {
    const product: ProductEntity = productsList[0];
    await expect(() =>
      service.findProductByCultureIdAndProductId('0', product.id),
    ).rejects.toHaveProperty(
      'message',
      'The culture with the given id was not found',
    );
  });

  it('findProductByCultureIdAndProductId should throw an exception for a restaurant not associated with the culture', async () => {
    const newProduct: ProductEntity = await productRepository.save({
      name: faker.company.name(),
      description: faker.lorem.paragraph(),
      history: faker.lorem.paragraph(),
      category: null,
      culture: null,
    });

    await expect(() =>
      service.findProductByCultureIdAndProductId(culture.id, newProduct.id),
    ).rejects.toHaveProperty(
      'message',
      'The product with the given id is not associated to the culture',
    );
  });

  it('findProductsByCultureId should return products by culture', async () => {
    const products: ProductEntity[] = await service.findProductsByCultureId(
      culture.id,
    );
    expect(products.length).toBe(5);
  });

  it('findProductsByCultureId should throw an exception for an invalid culture', async () => {
    await expect(() =>
      service.findProductsByCultureId('0'),
    ).rejects.toHaveProperty(
      'message',
      'The culture with the given id was not found',
    );
  });

  it('associateProductsToCulture should update products list for a culture', async () => {
    const newProduct: ProductEntity = await productRepository.save({
      name: faker.company.name(),
      description: faker.lorem.paragraph(),
      history: faker.lorem.paragraph(),
      category: null,
      culture: null,
    });

    const updatedCulture: CultureEntity =
      await service.associateProductToCulture(culture.id, [newProduct]);
    expect(updatedCulture.products.length).toBe(1);
    expect(updatedCulture.products[0].name).toBe(newProduct.name);
  });

  it('associateProductsToCulture should throw an exception for an invalid culture', async () => {
    const newProduct: ProductEntity = await productRepository.save({
      name: faker.company.name(),
      description: faker.lorem.paragraph(),
      history: faker.lorem.paragraph(),
      category: null,
      culture: null,
    });

    await expect(() =>
      service.associateProductToCulture('0', [newProduct]),
    ).rejects.toHaveProperty(
      'message',
      'The culture with the given id was not found',
    );
  });

  it('associateProductsToCulture should throw an exception for an invalid restaurant', async () => {
    const newProduct: ProductEntity = productsList[0];
    newProduct.id = '0';

    await expect(() =>
      service.associateProductToCulture(culture.id, [newProduct]),
    ).rejects.toHaveProperty(
      'message',
      'The product with the given id was not found',
    );
  });

  it('deleteProductFromCulture should remove a product from a culture', async () => {
    const product: ProductEntity = productsList[0];

    await service.deleteCultureProduct(culture.id, product.id);

    const storedCulture: CultureEntity = await cultureRepository.findOne({
      where: { id: culture.id },
      relations: ['products'],
    });
    const deletedProduct: ProductEntity = storedCulture.products.find(
      (a) => a.id === product.id,
    );

    expect(deletedProduct).toBeUndefined();
  });

  it('deleteProductFromCulture should throw an exception for an invalid restaurant', async () => {
    await expect(() =>
      service.deleteCultureProduct(culture.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The product with the given id was not found',
    );
  });

  it('deleteProductFromCulture should throw an exception for an invalid culture', async () => {
    const product: ProductEntity = productsList[0];
    await expect(() =>
      service.deleteCultureProduct('0', product.id),
    ).rejects.toHaveProperty(
      'message',
      'The culture with the given id was not found',
    );
  });

  it('deleteProductFromCulture should throw an exception for a non-associated product', async () => {
    const newProduct: ProductEntity = await productRepository.save({
      name: faker.company.name(),
      description: faker.lorem.paragraph(),
      history: faker.lorem.paragraph(),
      category: null,
      culture: null,
    });

    await expect(() =>
      service.deleteCultureProduct(culture.id, newProduct.id),
    ).rejects.toHaveProperty(
      'message',
      'The product with the given id is not associated to the culture',
    );
  });
});
