import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { CultureEntity } from '../culture/culture.entity/culture.entity';
import { ProductEntity } from '../product/product.entity';


@Injectable()
  export class ProductCultureService {
  constructor(
       @InjectRepository(ProductEntity)
       private readonly productRepository: Repository<ProductEntity>,

       @InjectRepository(CultureEntity)
       private readonly cultureRepository: Repository<CultureEntity>
   ) {}

  async addProductCulture(cultureId: string, productId: string): Promise<CultureEntity> {
    const product: ProductEntity = await this.productRepository.findOne({where: {id: productId}})
      if (!product)
        throw new BusinessLogicException("The product with the given id was not found", BusinessError.NOT_FOUND);
    
    const culture: CultureEntity = await this.cultureRepository.findOne({where: {id: cultureId}, relations: ["products"]});
      if (!culture)
        throw new BusinessLogicException("The culture with the given id was not found", BusinessError.NOT_FOUND);

    culture.products = [...culture.products, product];
    return await this.cultureRepository.save(culture);
  }

  async findProductByCultureIdAndProductId(cultureId: string, productId: string): Promise<ProductEntity> {
    const product: ProductEntity = await this.productRepository.findOne({ where: { id: productId } });
    if (!product)
      throw new BusinessLogicException("The product with the given id was not found", BusinessError.NOT_FOUND);

    const culture: CultureEntity = await this.cultureRepository.findOne({ where: { id: cultureId }, relations: ["products"] });
    if (!culture)
      throw new BusinessLogicException("The culture with the given id was not found", BusinessError.NOT_FOUND);
 
    const cultureProduct: ProductEntity = culture.products.find(e => e.id === product.id);

    if (!cultureProduct)
      throw new BusinessLogicException("The product with the given id is not associated to the culture", BusinessError.PRECONDITION_FAILED);

    return cultureProduct;
  }

  async findProductsByCultureId(cultureId: string): Promise<ProductEntity[]> {
      const culture: CultureEntity = await this.cultureRepository.findOne({where: {id: cultureId}, relations: ["products"]});
      if (!culture)
        throw new BusinessLogicException("The culture with the given id was not found", BusinessError.NOT_FOUND)

      return culture.products;
  }

  async associateProductToCulture(cultureId: string, products: ProductEntity[]): Promise<CultureEntity> {
      const culture: CultureEntity = await this.cultureRepository.findOne({where: {id: cultureId}, relations: ["products"]});

      if (!culture)
        throw new BusinessLogicException("The culture with the given id was not found", BusinessError.NOT_FOUND)

      for (let i = 0; i < products.length; i++) {
        const product: ProductEntity = await this.productRepository.findOne({where: {id: products[i].id}});
        if (!product)
          throw new BusinessLogicException("The product with the given id was not found", BusinessError.NOT_FOUND)
      }

      culture.products = products;
      return await this.cultureRepository.save(culture);
    }

  async deleteCultureProduct(cultureId: string, productId: string){
    const culture: CultureEntity = await this.cultureRepository.findOne({ where: { id: cultureId }, relations: ["products"] });
    if (!culture)
      throw new BusinessLogicException("The culture with the given id was not found", BusinessError.NOT_FOUND)

    const product: ProductEntity = await this.productRepository.findOne({where: {id: productId}});
    if (!product)
      throw new BusinessLogicException("The product with the given id was not found", BusinessError.NOT_FOUND)

    const cultureProduct: ProductEntity = culture.products.find(e => e.id === product.id);

    if (!cultureProduct)
        throw new BusinessLogicException("The product with the given id is not associated to the culture", BusinessError.PRECONDITION_FAILED)

    culture.products = culture.products.filter(e => e.id !== productId);
    await this.cultureRepository.save(culture);
  }
}