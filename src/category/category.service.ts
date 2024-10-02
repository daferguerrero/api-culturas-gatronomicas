import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryEntity } from './category.entity';
import { CategoryDto } from './category.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class CategoryService {

  cacheKey: string = "categories";

  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
    
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache
  ) {}

  // Método para encontrar todas las categorías
  async findAll(): Promise<CategoryEntity[]> {
    
    const cached: CategoryEntity[] = await this.cacheManager.get<CategoryEntity[]>(this.cacheKey);
    if(!cached){
      const categories: CategoryEntity[] = await this.categoryRepository.find();
      await this.cacheManager.set(this.cacheKey, categories);
      return categories;
    }
    return cached;
  }

  // Método para encontrar una categoría por ID
  async findOne(id: string): Promise<CategoryEntity> {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException(`The category with the given id was not found`);
    }
    return category;
  }

  // Método para crear una nueva categoría
  async create(categoryDto: CategoryDto): Promise<CategoryEntity> {
    const category = this.categoryRepository.create(categoryDto);
    return await this.categoryRepository.save(category);
  }

  // Método para actualizar una categoría existente
  async update(id: string, categoryDto: CategoryDto): Promise<CategoryEntity> {
    const category = await this.categoryRepository.preload({
      id,
      ...categoryDto,
    });
    if (!category) {
      throw new NotFoundException(`The category with the given id was not found`);
    }
    return await this.categoryRepository.save(category);
  }

  // Método para eliminar una categoría por ID
  async delete(id: string): Promise<void> {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException(`The category with the given id was not found`);
    }
    await this.categoryRepository.remove(category);
  }
}
