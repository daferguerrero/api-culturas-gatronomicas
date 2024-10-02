import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';
import { CultureEntity } from './culture.entity/culture.entity';
import { CultureService } from './culture.service';
import { CacheModule } from '@nestjs/cache-manager';



describe('CultureService', () => {
  let service: CultureService;
  let repository: Repository<CultureEntity>;
  let cultureList: CultureEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig(), CacheModule.register()],
      providers: [CultureService, ],
    }).compile();

    service = module.get<CultureService>(CultureService);
    repository = module.get<Repository<CultureEntity>>(getRepositoryToken(CultureEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    cultureList = [];
    for(let i = 0; i < 5; i++){
        const culture: CultureEntity = await repository.save({
          name: faker.company.name(),
          description: faker.lorem.sentence(),
        })
        cultureList.push(culture);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all cultures', async () => {
    const cultures: CultureEntity[] = await service.findAll();
    expect(cultures).not.toBeNull();
    expect(cultures).toHaveLength(cultureList.length);
  });

  it('findOne should return a culture by id', async () => {
    const storedCulture: CultureEntity = cultureList[0];
    const culture: CultureEntity = await service.findOne(storedCulture.id);
    expect(culture).not.toBeNull();
    expect(culture.name).toEqual(storedCulture.name)
    expect(culture.description).toEqual(storedCulture.description)
  });

  it('findOne should throw an exception for an invalid culture', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The culture with the given id was not found")
  });

  it('create should return a new culture', async () => {
    const culture: CultureEntity = {
      id: "",
      name: faker.company.name(),
      description: faker.lorem.sentence(),
      restaurants: [],
      recipes: [],
      products: [],
    }

    const newCulture: CultureEntity = await service.create(culture);
    expect(newCulture).not.toBeNull();

    const storedCulture: CultureEntity = await repository.findOne({where: {id: newCulture.id}})
    expect(storedCulture).not.toBeNull();
    expect(storedCulture.name).toEqual(newCulture.name)
    expect(storedCulture.description).toEqual(newCulture.description)
  });

  it('update should modify a culture', async () => {
    const culture: CultureEntity = cultureList[0];
    culture.name = "New name";
     const updatedCulture: CultureEntity = await service.update(culture.id, culture);
    expect(updatedCulture).not.toBeNull();
     const storedCulture: CultureEntity = await repository.findOne({ where: { id: culture.id } })
    expect(storedCulture).not.toBeNull();
    expect(storedCulture.name).toEqual(culture.name)
  });

  it('update should throw an exception for an invalid culture', async () => {
    let culture: CultureEntity = cultureList[0];
    culture = {
      ...culture, name: "New name", description: "New description"
    }
    await expect(() => service.update("0", culture)).rejects.toHaveProperty("message", "The culture with the given id was not found")
  });

  it('delete should remove a culture', async () => {
    const culture: CultureEntity = cultureList[0];
    await service.delete(culture.id);
     const deletedCulture: CultureEntity = await repository.findOne({ where: { id: culture.id } })
    expect(deletedCulture).toBeNull();
  });

  it('delete should throw an exception for an invalid culture', async () => {
    const culture: CultureEntity = cultureList[0];
    await service.delete(culture.id);
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The culture with the given id was not found")
  });


 });


