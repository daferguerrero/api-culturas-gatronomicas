import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CategoryEntity } from '../category/category.entity';
import { ProductEntity } from '../product/product.entity';
import { ProductCategoryService } from './product-category.service';

describe('CategoryProductService', () => {
  let service: ProductCategoryService;
  let categoryRepository: Repository<CategoryEntity>;
  let productRepository: Repository<ProductEntity>;
  let category: CategoryEntity;
  let productsList: ProductEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ProductCategoryService],
    }).compile();

    service = module.get<ProductCategoryService>(ProductCategoryService);
    categoryRepository = module.get<Repository<CategoryEntity>>(getRepositoryToken(CategoryEntity));
    productRepository = module.get<Repository<ProductEntity>>(getRepositoryToken(ProductEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    await productRepository.clear();
    await categoryRepository.clear();

    productsList = [];
    for(let i = 0; i < 5; i++){
      const product: ProductEntity = await productRepository.save({
        name: faker.commerce.productName(),
        description: faker.lorem.paragraph(),
        history: faker.lorem.paragraph(),
        category: null,
        culture: null,
      });
      productsList.push(product);
    }

    category = await categoryRepository.save({
      name: faker.commerce.department(),
      description: faker.lorem.sentence(),
      products: productsList,
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addProductToCategory should add a product to a category', async () => {
    const newProduct: ProductEntity = await productRepository.save({
      name: faker.commerce.productName(),
      description: faker.lorem.paragraph(),
      history: faker.lorem.paragraph(),
      category: null,
      culture: null,
    });

    const newCategory: CategoryEntity = await categoryRepository.save({
      name: faker.commerce.department(),
      description: faker.lorem.sentence(),
    });

    const result: CategoryEntity = await service.addProductCategory(newCategory.id, newProduct.id);

    expect(result.products.length).toBe(1);
    expect(result.products[0]).not.toBeNull();
    expect(result.products[0].name).toBe(newProduct.name);
  });

  it('addProductToCategory should throw an exception for an invalid product', async () => {
    const newCategory: CategoryEntity = await categoryRepository.save({
      name: faker.commerce.department(),
      description: faker.lorem.sentence(),
    });

    await expect(() => service.addProductCategory(newCategory.id, "0")).rejects.toHaveProperty("message", "The product with the given id was not found");
  });

  it('addProductToCategory should throw an exception for an invalid category', async () => {
    const newProduct: ProductEntity = await productRepository.save({
      name: faker.commerce.productName(),
      description: faker.lorem.paragraph(),
      history: faker.lorem.paragraph(),
      category: null,
      culture: null,
    });

    await expect(() => service.addProductCategory("0", newProduct.id)).rejects.toHaveProperty("message", "The category with the given id was not found");
  });

  it('findProductByCategoryIdAndProductId should return product by category', async () => {
    const product: ProductEntity = productsList[0];
    const storedProduct: ProductEntity = await service.findCategoryByProductIdCategoryId(category.id, product.id);
    expect(storedProduct).not.toBeNull();
    expect(storedProduct.name).toBe(product.name);
  });

  it('findProductByCategoryIdAndProductId should throw an exception for an invalid product', async () => {
    await expect(() => service.findCategoryByProductIdCategoryId(category.id, "0")).rejects.toHaveProperty("message", "The product with the given id was not found");
  });

  it('findProductByCategoryIdAndProductId should throw an exception for an invalid category', async () => {
    const product: ProductEntity = productsList[0];
    await expect(() => service.findCategoryByProductIdCategoryId("0", product.id)).rejects.toHaveProperty("message", "The category with the given id was not found");
  });

  it('findProductByCategoryIdAndProductId should throw an exception for a product not associated with the category', async () => {
    const newProduct: ProductEntity = await productRepository.save({
      name: faker.commerce.productName(),
      description: faker.lorem.paragraph(),
      history: faker.lorem.paragraph(),
      category: null,
      culture: null,
    });

    await expect(() => service.findCategoryByProductIdCategoryId(category.id, newProduct.id)).rejects.toHaveProperty("message", "The product with the given id is not associated to the category");
  });

  it('findProductsByCategoryId should return products by category', async () => {
    const products: ProductEntity[] = await service.findCategoriesByProductId(category.id);
    expect(products.length).toBe(5);
  });

  it('findProductsByCategoryId should throw an exception for an invalid category', async () => {
    await expect(() => service.findCategoriesByProductId("0")).rejects.toHaveProperty("message", "The category with the given id was not found");
  });

  it('associateProductsToCategory should update products list for a category', async () => {
    const newProduct: ProductEntity = await productRepository.save({
      name: faker.commerce.productName(),
      description: faker.lorem.paragraph(),
      history: faker.lorem.paragraph(),
      category: null,
      culture: null,
    });

    const updatedCategory: CategoryEntity = await service.associateCategoriesProduct(category.id, [newProduct]);
    expect(updatedCategory.products.length).toBe(1);
    expect(updatedCategory.products[0].name).toBe(newProduct.name);
  });

  it('associateProductsToCategory should throw an exception for an invalid category', async () => {
    const newProduct: ProductEntity = await productRepository.save({
      name: faker.commerce.productName(),
      description: faker.lorem.paragraph(),
      history: faker.lorem.paragraph(),
      category: null,
      culture: null,
    });

    await expect(() => service.associateCategoriesProduct("0", [newProduct])).rejects.toHaveProperty("message", "The category with the given id was not found");
  });

  it('associateProductsToCategory should throw an exception for an invalid product', async () => {
    const newProduct: ProductEntity = productsList[0];
    newProduct.id = "0";

    await expect(() => service.associateCategoriesProduct(category.id, [newProduct])).rejects.toHaveProperty("message", "The product with the given id was not found");
  });

  it('deleteProductFromCategory should remove a product from a category', async () => {
    const product: ProductEntity = productsList[0];

    await service.deleteProductFromCategory(category.id, product.id);

    const storedCategory: CategoryEntity = await categoryRepository.findOne({ where: { id: category.id }, relations: ["products"] });
    const deletedProduct: ProductEntity = storedCategory.products.find(p => p.id === product.id);

    expect(deletedProduct).toBeUndefined();
  });

  it('deleteProductFromCategory should throw an exception for an invalid product', async () => {
    await expect(() => service.deleteProductFromCategory(category.id, "0")).rejects.toHaveProperty("message", "The product with the given id was not found");
  });

  it('deleteProductFromCategory should throw an exception for an invalid category', async () => {
    const product: ProductEntity = productsList[0];
    await expect(() => service.deleteProductFromCategory("0", product.id)).rejects.toHaveProperty("message", "The category with the given id was not found");
  });

  it('deleteProductFromCategory should throw an exception for a non-associated product', async () => {
    const newProduct: ProductEntity = await productRepository.save({
      name: faker.commerce.productName(),
      description: faker.lorem.paragraph(),
      history: faker.lorem.paragraph(),
      category: null,
      culture: null,
    });

    await expect(() => service.deleteProductFromCategory(category.id, newProduct.id)).rejects.toHaveProperty("message", "The product with the given id is not associated to the category");
  });
});