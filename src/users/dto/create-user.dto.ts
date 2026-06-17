import { IsString, IsOptional, IsArray, IsEmail } from 'class-validator';

export class CreateUserDto{

    @IsString()
    username!:string;

   

   


    @IsString()
    @IsOptional()
    bio?:string

    @IsString()
    @IsOptional()
    profileUrl?:string

    @IsString()
    @IsOptional()
    city?:string

    @IsArray()
    @IsOptional()
    interests?:string[];


    
}