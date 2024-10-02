import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';
import { CultureDto } from 'src/culture/culture.dto/culture.dto';

@InputType()
export class RecipeDto {

  @Field()
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @Field()
  @IsString()
  readonly description: string;

  @Field()
  @IsString()
  readonly photo: string;

  @Field()
  @IsString()
  readonly preparation: string;

  @Field()
  @IsString()
  readonly video: string;

}