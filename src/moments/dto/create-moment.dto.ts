import { IsDateString, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateMomentDto {

    @IsString()
    @IsOptional()
    caption?:string;

    @IsString()
    mediaUrl!:string;

    @IsString()
    category!:string;

    @IsNumber()
    latitude!:number;

    @IsNumber()
    longitude!:number;

    @IsDateString()
    expiresAt!:number;


}
