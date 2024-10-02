import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CultureEntity } from '../culture/culture.entity/culture.entity';
import { RecipeEntity } from '../recipe/recipe.entity/recipe.entity';
import { CultureRecipeService } from '../culture-recipe/culture-recipe.service';

describe('CultureRecipeService', () => {
  let service: CultureRecipeService;
  let cultureRepository: Repository<CultureEntity>;
  let recipeRepository: Repository<RecipeEntity>;
  let culture: CultureEntity;
  let recipeList: RecipeEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CultureRecipeService],
    }).compile();

    service = module.get<CultureRecipeService>(CultureRecipeService);
    cultureRepository = module.get<Repository<CultureEntity>>(getRepositoryToken(CultureEntity));
    recipeRepository = module.get<Repository<RecipeEntity>>(getRepositoryToken(RecipeEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    await recipeRepository.clear();
    await cultureRepository.clear();

    recipeList = [];
    for (let i = 0; i < 5; i++) {
      const recipe: RecipeEntity = await recipeRepository.save({
        name: faker.lorem.words(),
        description: faker.lorem.paragraph(),
        photo: faker.image.url(),
        preparation: faker.lorem.paragraphs(),
        video: faker.internet.url(),
        culture: null,
      });
      recipeList.push(recipe);
    }

    culture = await cultureRepository.save({
      name: faker.company.name(),
      description: faker.lorem.sentence(),
      recipes: recipeList,
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addRecipeToCulture should add a recipe to a culture', async () => {
    const newRecipe: RecipeEntity = await recipeRepository.save({
      name: faker.lorem.words(),
      description: faker.lorem.paragraph(),
      photo: faker.image.url(),
      preparation: faker.lorem.paragraphs(),
      video: faker.internet.url(),
      culture: null,
    });

    const newCulture: CultureEntity = await cultureRepository.save({
      name: faker.company.name(),
      description: faker.lorem.sentence(),
    });

    const result: CultureEntity = await service.addRecipeToCulture(newCulture.id, newRecipe.id);

    expect(result.recipes.length).toBe(1);
    expect(result.recipes[0]).not.toBeNull();
    expect(result.recipes[0].name).toBe(newRecipe.name);
  });

  it('addRecipeToCulture should throw an exception for an invalid recipe', async () => {
    const newCulture: CultureEntity = await cultureRepository.save({
      name: faker.company.name(),
      description: faker.lorem.sentence(),
    });

    await expect(() => service.addRecipeToCulture(newCulture.id, "0")).rejects.toHaveProperty("message", "The recipe with the given id was not found");
  });

  it('addRecipeToCulture should throw an exception for an invalid culture', async () => {
    const newRecipe: RecipeEntity = await recipeRepository.save({
      name: faker.lorem.words(),
      description: faker.lorem.paragraph(),
      photo: faker.image.url(),
      preparation: faker.lorem.paragraphs(),
      video: faker.internet.url(),
      culture: null,
    });

    await expect(() => service.addRecipeToCulture("0", newRecipe.id)).rejects.toHaveProperty("message", "The culture with the given id was not found");
  });

  it('findRecipeByCultureIdAndRecipeId should return recipe by culture', async () => {
    const recipe: RecipeEntity = recipeList[0];
    const storedRecipe: RecipeEntity = await service.findRecipeByCultureIdAndRecipeId(culture.id, recipe.id);
    expect(storedRecipe).not.toBeNull();
    expect(storedRecipe.name).toBe(recipe.name);
  });

  it('findRecipeByCultureIdAndRecipeId should throw an exception for an invalid recipe', async () => {
    await expect(() => service.findRecipeByCultureIdAndRecipeId(culture.id, "0")).rejects.toHaveProperty("message", "The recipe with the given id is not associated with the culture");
  });

  it('findRecipeByCultureIdAndRecipeId should throw an exception for an invalid culture', async () => {
    const recipe: RecipeEntity = recipeList[0];
    await expect(() => service.findRecipeByCultureIdAndRecipeId("0", recipe.id)).rejects.toHaveProperty("message", "The culture with the given id was not found");
  });

  it('findRecipeByCultureIdAndRecipeId should throw an exception for a recipe not associated with the culture', async () => {
    const newRecipe: RecipeEntity = await recipeRepository.save({
      name: faker.lorem.words(),
      description: faker.lorem.paragraph(),
      photo: faker.image.url(),
      preparation: faker.lorem.paragraphs(),
      video: faker.internet.url(),
      culture: null,
    });

    await expect(() => service.findRecipeByCultureIdAndRecipeId(culture.id, newRecipe.id)).rejects.toHaveProperty("message", "The recipe with the given id is not associated with the culture");
  });

  it('findRecipesByCultureId should return recipes by culture', async () => {
    const recipes: RecipeEntity[] = await service.findRecipesByCultureId(culture.id);
    expect(recipes.length).toBe(5);
  });

  it('findRecipesByCultureId should throw an exception for an invalid culture', async () => {
    await expect(() => service.findRecipesByCultureId("0")).rejects.toHaveProperty("message", "The culture with the given id was not found");
  });

  it('associateRecipesToCulture should update recipes list for a culture', async () => {
    const newRecipe: RecipeEntity = await recipeRepository.save({
      name: faker.lorem.words(),
      description: faker.lorem.paragraph(),
      photo: faker.image.url(),
      preparation: faker.lorem.paragraphs(),
      video: faker.internet.url(),
      culture: null,
    });

    const updatedCulture: CultureEntity = await service.associateRecipesToCulture(culture.id, [newRecipe]);
    expect(updatedCulture.recipes.length).toBe(1);
    expect(updatedCulture.recipes[0].name).toBe(newRecipe.name);
  });

  it('associateRecipesToCulture should throw an exception for an invalid culture', async () => {
    const newRecipe: RecipeEntity = await recipeRepository.save({
      name: faker.lorem.words(),
      description: faker.lorem.paragraph(),
      photo: faker.image.url(),
      preparation: faker.lorem.paragraphs(),
      video: faker.internet.url(),
      culture: null,
    });

    await expect(() => service.associateRecipesToCulture("0", [newRecipe])).rejects.toHaveProperty("message", "The culture with the given id was not found");
  });

  it('associateRecipesToCulture should throw an exception for an invalid recipe', async () => {
    const newRecipe: RecipeEntity = recipeList[0];
    newRecipe.id = "0";

    await expect(() => service.associateRecipesToCulture(culture.id, [newRecipe])).rejects.toHaveProperty("message", "The recipe with the given id was not found");
  });

  it('deleteRecipeFromCulture should remove a recipe from a culture', async () => {
    const recipe: RecipeEntity = recipeList[0];

    await service.deleteRecipeFromCulture(culture.id, recipe.id);

    const storedCulture: CultureEntity = await cultureRepository.findOne({ where: { id: culture.id }, relations: ["recipes"] });
    const deletedRecipe: RecipeEntity = storedCulture.recipes.find(a => a.id === recipe.id);

    expect(deletedRecipe).toBeUndefined();
  });

  it('deleteRecipeFromCulture should throw an exception for an invalid recipe', async () => {
    await expect(() => service.deleteRecipeFromCulture(culture.id, "0")).rejects.toHaveProperty("message", "The recipe with the given id is not associated with the culture");
  });

  it('deleteRecipeFromCulture should throw an exception for an invalid culture', async () => {
    const recipe: RecipeEntity = recipeList[0];
    await expect(() => service.deleteRecipeFromCulture("0", recipe.id)).rejects.toHaveProperty("message", "The culture with the given id was not found");
  });

  it('deleteRecipeFromCulture should throw an exception for a recipe not associated with the culture', async () => {
    const newRecipe: RecipeEntity = await recipeRepository.save({
      name: faker.lorem.words(),
      description: faker.lorem.paragraph(),
      photo: faker.image.url(),
      preparation: faker.lorem.paragraphs(),
      video: faker.internet.url(),
      culture: null,
    });

    await expect(() => service.deleteRecipeFromCulture(culture.id, newRecipe.id)).rejects.toHaveProperty("message", "The recipe with the given id is not associated with the culture");
  });
});