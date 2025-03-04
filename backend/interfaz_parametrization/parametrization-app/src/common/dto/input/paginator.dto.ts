import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNumber, IsOptional, IsPositive } from "class-validator";

export class PaginatorDto {
    @ApiProperty()
    @IsNumber()
    @IsOptional()
    @Transform(({ value }) => parseInt(value, 10))
    limit?: number = 20;
    
    @ApiProperty()
    @IsPositive()
    @IsNumber()
    @IsOptional()
    @Transform(({ value }) => parseInt(value, 10))
    page?: number = 1;
}