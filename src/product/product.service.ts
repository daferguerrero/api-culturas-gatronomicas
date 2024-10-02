import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductEntity } from './product.entity';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class ProductService {

   cacheKey: string = "products";

  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache
  ) {}

  // Método para crear un producto
  async create(product: ProductEntity): Promise<ProductEntity> {

    return await this.productRepository.save(product);
  }

  // Método para obtener todos los productos
  async findAll(): Promise<ProductEntity[]> {

    const cached: ProductEntity[] = await this.cacheManager.get<ProductEntity[]>(this.cacheKey);

    if(!cached){
      const products: ProductEntity[] = await this.productRepository.find({relations: ["category", "culture"]});
      await this.cacheManager.set(this.cacheKey, products);
      return products;
    }
    return cached;
  }

  // Método para obtener un producto por su ID
  async findOne(id: string): Promise<ProductEntity> {
    const product: ProductEntity = await this.productRepository.findOne({ where: { id }, relations: ["category", "culture"] } );
      if (!product)
        throw new BusinessLogicException("No se encontró el producto con la identificación proporcionada", BusinessError.NOT_FOUND);

    return product;
  }

  // Método para actualizar un producto por su ID
  async update(id: string, product: ProductEntity): Promise<ProductEntity > {
    const persistedProduct: ProductEntity = await this.productRepository.findOne({where: {id}});
      if (!persistedProduct)
      throw new BusinessLogicException("No se encontró el museo con la identificación proporcionada", BusinessError.NOT_FOUND);

    return await this.productRepository.save({...persistedProduct, ...product});
  }

  // Método para eliminar un producto
  async delete(id: string) {
    const product: ProductEntity = await this.productRepository.findOne({where: {id}});
    if (!product)
      throw new BusinessLogicException("No se encontró el museo con la identificación proporcionada", BusinessError.NOT_FOUND);

      await this.productRepository.remove(product);
  }
}

