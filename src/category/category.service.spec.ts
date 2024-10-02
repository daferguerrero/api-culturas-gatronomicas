import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CategoryEntity } from './category.entity';
import { CategoryService } from './category.service';
import { CacheModule } from '@nestjs/cache-manager';

describe('CategoryService', () => {
  let service: CategoryService;
  let categoryRepository: Repository<CategoryEntity>;
  let category: CategoryEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig(), CacheModule.register()],
      providers: [CategoryService],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
    categoryRepository = module.get<Repository<CategoryEntity>>(getRepositoryToken(CategoryEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    await categoryRepository.clear();

    category = await categoryRepository.save({
      name: faker.commerce.department(),
      description: faker.lorem.sentence(),
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all categories', async () => {
    const categories: CategoryEntity[] = await service.findAll();
    expect(categories).not.toBeNull();
    expect(categories.length).toBe(1);
  });

  it('findOne should return a category by id', async () => {
    const storedCategory: CategoryEntity = await service.findOne(category.id);
    expect(storedCategory).not.toBeNull();
    expect(storedCategory.name).toBe(category.name);
  });

  it('findOne should throw an exception for an invalid category', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty('message', 'The category with the given id was not found');
  });

  it('create should create a new category', async () => {
    const categoryDto = {
      name: faker.commerce.department(),
      year: faker.number.int({ min: 1900, max: 2023 }),
      description: faker.lorem.sentence(),
      type: faker.commerce.product(),
      mainImage: faker.image.url(),
    };

    const newCategory: CategoryEntity = await service.create(categoryDto);
    expect(newCategory).not.toBeNull();

    const storedCategory: CategoryEntity = await categoryRepository.findOne({ where: { id: newCategory.id } });
    expect(storedCategory).not.toBeNull();
    expect(storedCategory.name).toBe(categoryDto.name);
  });

  it('update should modify a category', async () => {
    const categoryDto = {
      name: faker.commerce.department(),
      year: faker.number.int({ min: 1900, max: 2023 }),
      description: faker.lorem.sentence(),
      type: faker.commerce.product(),
      mainImage: faker.image.url(),
    };

    const updatedCategory: CategoryEntity = await service.update(category.id, categoryDto);
    expect(updatedCategory).not.toBeNull();

    const storedCategory: CategoryEntity = await categoryRepository.findOne({ where: { id: category.id } });
    expect(storedCategory).not.toBeNull();
    expect(storedCategory.name).toBe(categoryDto.name);
  });

  it('update should throw an exception for an invalid category', async () => {
    const categoryDto = {
      name: faker.commerce.department(),
      year: faker.number.int({ min: 1900, max: 2023 }),
      description: faker.lorem.sentence(),
      type: faker.commerce.product(),
      mainImage: faker.image.url(),
    };

    await expect(() => service.update('0', categoryDto)).rejects.toHaveProperty('message', 'The category with the given id was not found');
  });

  it('delete should remove a category', async () => {
    await service.delete(category.id);

    const deletedCategory: CategoryEntity = await categoryRepository.findOne({ where: { id: category.id } });
    expect(deletedCategory).toBeNull();
  });

  it('delete should throw an exception for an invalid category', async () => {
    await expect(() => service.delete('0')).rejects.toHaveProperty('message', 'The category with the given id was not found');
  });
});
