/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString, IsInt, IsDate, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class RestaurantDto {

  @Field()
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @Field()
  @IsInt()
  @IsNotEmpty()
  readonly michelinStars: number;

  @Field()
  @IsDateString()
  @IsNotEmpty()
  readonly achievementDate: string;

}
