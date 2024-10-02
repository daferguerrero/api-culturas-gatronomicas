import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { CountryEntity } from '../country/country.entity';
import { RestaurantEntity } from '../restaurant/restaurant.entity/restaurant.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class CityEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  name: string;

  @Field((type) => CountryEntity)
  @ManyToOne(() => CountryEntity, (country) => country.cities)
  country: CountryEntity;

  @Field((type) => [RestaurantEntity])
  @OneToMany(() => RestaurantEntity, restaurant => restaurant.city)
  restaurants: RestaurantEntity[];
}
