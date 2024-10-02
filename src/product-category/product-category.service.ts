import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { CategoryEntity } from '../category/category.entity';
import { ProductEntity } from '../product/product.entity';

@Injectable()
export class ProductCategoryService {
  constructor(
       @InjectRepository(ProductEntity)
       private readonly productRepository: Repository<ProductEntity>,

       @InjectRepository(CategoryEntity)
       private readonly categoryRepository: Repository<CategoryEntity>
   ) {}

  async addProductCategory(categoryId: string, productId: string): Promise<CategoryEntity> {
    const product: ProductEntity = await this.productRepository.findOne({where: {id: productId}})
    if (!product)
      throw new BusinessLogicException("The product with the given id was not found", BusinessError.NOT_FOUND);
        
    const category: CategoryEntity = await this.categoryRepository.findOne({where: {id: categoryId}, relations: ["products"] });
    if (!category)
      throw new BusinessLogicException("The category with the given id was not found", BusinessError.NOT_FOUND);

    category.products = [...category.products, product];
    return await this.categoryRepository.save(category);
  }

  async findCategoryByProductIdCategoryId(categoryId: string, productId: string): Promise<ProductEntity> {
    const product: ProductEntity = await this.productRepository.findOne({where: {id: productId}});
    if (!product)
      throw new BusinessLogicException("The product with the given id was not found", BusinessError.NOT_FOUND)
  
    const category: CategoryEntity = await this.categoryRepository.findOne({where: {id: categoryId}, relations: ["products"]});
    if (!category)
      throw new BusinessLogicException("The category with the given id was not found", BusinessError.NOT_FOUND)
      
    const productCategory: ProductEntity = category.products.find(e => e.id === product.id);

    if (!productCategory)
      throw new BusinessLogicException("The product with the given id is not associated to the category", BusinessError.PRECONDITION_FAILED)

    return productCategory;
  }

  async findCategoriesByProductId(categoryId: string): Promise<ProductEntity[]> {
    const category: CategoryEntity = await this.categoryRepository.findOne({where: {id: categoryId}, relations: ["products"]});
    if (!category)
      throw new BusinessLogicException("The category with the given id was not found", BusinessError.NOT_FOUND)

    return category.products;
  }

  async associateCategoriesProduct(categoryId: string, products: ProductEntity[]): Promise<CategoryEntity> {
    const category: CategoryEntity = await this.categoryRepository.findOne({where: {id: categoryId}, relations: ["products"]});  

    if (!category)
      throw new BusinessLogicException("The category with the given id was not found", BusinessError.NOT_FOUND)

    for (let i = 0; i < products.length; i++) {
      const product: ProductEntity = await this.productRepository.findOne({where: {id: products[i].id}});
      if (!product)
        throw new BusinessLogicException("The product with the given id was not found", BusinessError.NOT_FOUND)
    }

    category.products = products;
    return await this.categoryRepository.save(category);
  }

    async deleteProductFromCategory(categoryId: string, productId: string) {
      const product: ProductEntity = await this.productRepository.findOne({ where: { id: productId } });
      if (!product)
        throw new BusinessLogicException("The product with the given id was not found", BusinessError.NOT_FOUND);
  
      const category: CategoryEntity = await this.categoryRepository.findOne({ where: { id: categoryId }, relations: ["products"] });
      if (!category)
        throw new BusinessLogicException("The category with the given id was not found", BusinessError.NOT_FOUND);
  
      const categoryProduct: ProductEntity = category.products.find(e => e.id === product.id);
  
      if (!categoryProduct)
        throw new BusinessLogicException("The product with the given id is not associated to the category", BusinessError.PRECONDITION_FAILED);
  
      category.products = category.products.filter(e => e.id !== productId);
      await this.categoryRepository.save(category);
    }
}

