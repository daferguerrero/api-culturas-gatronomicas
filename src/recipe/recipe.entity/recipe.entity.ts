import { Field, ObjectType } from '@nestjs/graphql';
import { CultureEntity } from '../../culture/culture.entity/culture.entity';
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@ObjectType()
@Entity()
export class RecipeEntity {
 
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
 photo: string;
 
 @Field()
 @Column()
 preparation: string;

 @Field()
 @Column()
 video: string;

 @Field((type) => CultureEntity)
 @ManyToOne(() => CultureEntity, culture => culture.recipes)
 culture: CultureEntity;
}