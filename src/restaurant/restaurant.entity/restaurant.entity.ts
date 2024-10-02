import { CityEntity } from '../../city/city.entity';
import { CultureEntity } from '../../culture/culture.entity/culture.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Field, GraphQLISODateTime, GraphQLTimestamp, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class RestaurantEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column('int')
  michelinStars: number;

  @Field()
  @Column()
  achievementDate: string;

  @Field((type) => CultureEntity)
  @ManyToOne(() => CultureEntity, culture => culture.restaurants)
  culture: CultureEntity;

  @Field((type) => CityEntity)
  @ManyToOne(() => CityEntity, city => city.restaurants)
  city: CityEntity;
}
