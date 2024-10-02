import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { CityEntity } from '../city/city.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class CountryEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  name: string;

  @Field((type) => [CityEntity])
  @OneToMany(() => CityEntity, (city) => city.country)
  cities: CityEntity[];
}
