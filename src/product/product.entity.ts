import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { CategoryEntity } from '../category/category.entity';
import { CultureEntity } from '../culture/culture.entity/culture.entity'
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class ProductEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  description: string;

  @Field()
  @Column()
  history: string;

  @ManyToOne(() => CategoryEntity, category => category.products)
  category: CategoryEntity;

  @Field(type => CultureEntity)
  @ManyToOne(() => CultureEntity, culture => culture.products)
  culture: CultureEntity;
}