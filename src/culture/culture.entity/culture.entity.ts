import { RecipeEntity } from '../../recipe/recipe.entity/recipe.entity';
import { RestaurantEntity } from '../../restaurant/restaurant.entity/restaurant.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ProductEntity } from '../../product/product.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class CultureEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column('text')
  description: string;


  @Field(type => [RestaurantEntity])
  @OneToMany(() => RestaurantEntity, restaurant => restaurant.culture)
  restaurants: RestaurantEntity[];

  @Field((type) =>[RecipeEntity] )
  @OneToMany(() => RecipeEntity, recipe => recipe.culture)
  recipes: RecipeEntity[];

  @Field(type => [ProductEntity])
  @OneToMany(() => ProductEntity, product => product.culture)
  products: ProductEntity[];
}