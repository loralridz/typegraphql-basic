import { Length,IsEmail } from "class-validator";
import {  Field, InputType } from "type-graphql";
import { emailAlreadyExists } from "./emailAlreadyExists";


@InputType()
export class RegisterInput{
    @Field() 
    @Length(1,255,{message:"Nooooo"})
    firstname: string;
    
    @Length(1,355)
    @Field() 
    lastname: string;
    
    
    @Field() 
    @IsEmail()
    @emailAlreadyExists({message:"Email already exists..."})
    email: string;
    
    @Field() 
    password: string;

}