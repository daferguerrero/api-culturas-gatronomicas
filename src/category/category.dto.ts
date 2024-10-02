import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsNumber, IsString, IsUrl } from "class-validator";

@InputType()
export class CategoryDto {
   @Field()
   @IsString()
   @IsNotEmpty()
   readonly name: string;
}