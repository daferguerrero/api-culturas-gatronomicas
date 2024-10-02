import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';
import { RecipeService } from './recipe.service';
import { CultureEntity } from 'src/culture/culture.entity/culture.entity';
import { RecipeEntity } from './recipe.entity/recipe.entity';
import { CacheModule } from '@nestjs/cache-manager';



describe('RecipeService', () => {
  let service: RecipeService;
  let repository: Repository<RecipeEntity>;
  let recipeList: RecipeEntity[];
  let culture: CultureEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig(),CacheModule.register()],
      providers: [RecipeService],
    }).compile();

    service = module.get<RecipeService>(RecipeService);
    repository = module.get<Repository<RecipeEntity>>(getRepositoryToken(RecipeEntity));
    
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const seedDatabase = async () => {
    repository.clear();
    recipeList = [];


/*    const cultureRepository = module.get<Repository<CultureEntity>>(getRepositoryToken(CultureEntity));
    culture = await cultureRepository.save({
      name: faker.company.name(),
      description: faker.lorem.sentence(),
    });*/

    for (let i = 0; i < 5; i++) {
      const recipe: RecipeEntity = await repository.save({
        name: faker.commerce.productName(),
        description: faker.lorem.sentence(),
        photo: faker.image.url(),
        preparation: faker.lorem.paragraph(),
        video: faker.internet.url(),
        culture: null,
      });
      recipeList.push(recipe);
    }
  };

  it('findAll should return all recipes', async () => {
    const recipes: RecipeEntity[] = await service.findAll();
    expect(recipes).not.toBeNull();
    expect(recipes).toHaveLength(recipeList.length);
  });

  it('findOne should return a recipe by id', async () => {
    const storedRecipe: RecipeEntity = recipeList[0];
    const recipe: RecipeEntity = await service.findOne(storedRecipe.id);
    expect(recipe).not.toBeNull();
    expect(recipe.name).toEqual(storedRecipe.name);
    expect(recipe.description).toEqual(storedRecipe.description);
  });

  it('findOne should throw an exception for an invalid recipe', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The recipe with the given id was not found");
  });

  it('create should return a new recipe', async () => {
    const recipe: RecipeEntity = {
      id: "",
      name: faker.commerce.productName(),
      description: faker.lorem.sentence(),
      photo: faker.image.url(),
      preparation: faker.lorem.paragraph(),
      video: faker.internet.url(),
      culture: culture,
    };

    const newRecipe: RecipeEntity = await service.create(recipe);
    expect(newRecipe).not.toBeNull();

    const storedRecipe: RecipeEntity = await repository.findOne({ where: { id: newRecipe.id } });
    expect(storedRecipe).not.toBeNull();
    expect(storedRecipe.name).toEqual(newRecipe.name);
    expect(storedRecipe.description).toEqual(newRecipe.description);
  });

  it('update should modify a recipe', async () => {
    const recipe: RecipeEntity = recipeList[0];
    recipe.name = "New name";

    const updatedRecipe: RecipeEntity = await service.update(recipe.id, recipe);
    expect(updatedRecipe).not.toBeNull();

    const storedRecipe: RecipeEntity = await repository.findOne({ where: { id: recipe.id } });
    expect(storedRecipe).not.toBeNull();
    expect(storedRecipe.name).toEqual(recipe.name);
  });

  it('update should throw an exception for an invalid recipe', async () => {
    let recipe: RecipeEntity = recipeList[0];
    recipe = { ...recipe, name: "New name", description: "New description" };

    await expect(() => service.update("0", recipe)).rejects.toHaveProperty("message", "The recipe with the given id was not found");
  });

  it('delete should remove a recipe', async () => {
    const recipe: RecipeEntity = recipeList[0];
    await service.delete(recipe.id);

    const deletedRecipe: RecipeEntity = await repository.findOne({ where: { id: recipe.id } });
    expect(deletedRecipe).toBeNull();
  });

  it('delete should throw an exception for an invalid recipe', async () => {
    const recipe: RecipeEntity = recipeList[0];
    await service.delete(recipe.id);

    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The recipe with the given id was not found");
  });
});
